/*
 * Nano Banana 🍌 手绘信息图生成器 v2.0
 * 分步引导式 Obsidian 插件
 * Step 1: 选择文档 → Step 2: 选择风格 → Step 3: AI分析确认 → Step 4: 逐张生成 → Step 5: 保存
 */
"use strict";
const obsidian = require("obsidian");

const VIEW_TYPE = "nano-banana-view";
const MODELS = {
  "nano-banana": { id: "gemini-2.5-flash-image", name: "🍌 Flash", desc: "快速生成" },
  "nano-banana-pro": { id: "gemini-3-pro-image-preview", name: "🍌 Pro", desc: "专业品质" },
};
const ASPECT_RATIOS = ["16:9","4:3","1:1","3:2","2:3","9:16","3:4","4:5","5:4","21:9"];
const RESOLUTIONS = ["1K", "2K", "4K"];
const API_BASE_DEFAULT = "https://generativelanguage.googleapis.com/v1beta/models";
function getApiBase(settings) {
  let base = (settings.customApiBase && settings.customApiBase.trim()) ? settings.customApiBase.trim().replace(/\/+$/, '') : API_BASE_DEFAULT;
  // 兼容各种填法：自动补全到 /v1beta/models
  if (!base.includes('googleapis.com')) {
    if (base.endsWith('/models')) return base;
    if (base.endsWith('/v1beta')) return base + '/models';
    // 只填了域名，如 https://cdn.12ai.org
    if (!base.includes('/v1beta') && !base.includes('/v1/')) base = base + '/v1beta/models';
  }
  return base;
}
function isThirdParty(settings) {
  return settings.customApiBase && settings.customApiBase.trim() && !settings.customApiBase.includes('googleapis.com');
}
function buildUrl(settings, modelId) {
  const base = getApiBase(settings);
  // 第三方用 Bearer header，不在 URL 里带 key；官方用 ?key=
  if (isThirdParty(settings)) {
    return base + "/" + modelId + ":generateContent";
  }
  return base + "/" + modelId + ":generateContent?key=" + settings.apiKey;
}
function buildHeaders(settings) {
  const h = { "Content-Type": "application/json" };
  if (isThirdParty(settings)) {
    h["Authorization"] = "Bearer " + settings.apiKey;
  }
  return h;
}

const PRESETS_DARK = {
  "✏️ Excalidraw 手写": { a1: "#FFFFFF", a2: "#CCCCCC", bg: "#1E1E1E", for: "极简、白板风", excalidraw: true },
  "💙 科技蓝调": { a1: "#64B5F6", a2: "#BA68C8", bg: "#1A1A2E", for: "科技、商业" },
  "🌅 活力橙黄": { a1: "#FFD54F", a2: "#FFB74D", bg: "#2C2C2C", for: "励志、教育" },
  "🍃 清新绿意": { a1: "#81C784", a2: "#4DD0E1", bg: "#1B4332", for: "健康、自然" },
  "🌸 温暖日落": { a1: "#FFB74D", a2: "#F48FB1", bg: "#2C2C2C", for: "生活、情感" },
  "💜 梦幻紫粉": { a1: "#BA68C8", a2: "#F48FB1", bg: "#1A1A2E", for: "创意、艺术" },
};
const PRESETS_LIGHT = {
  "✏️ Excalidraw 手写": { a1: "#1A1A1A", a2: "#555555", bg: "#FFFFFF", for: "极简、白板风", excalidraw: true },
  "💼 商务专业": { a1: "#1976D2", a2: "#FF9800", bg: "#FFFFFF", for: "职场、商业" },
  "🌿 自然清新": { a1: "#4CAF50", a2: "#FFC107", bg: "#F5F5F5", for: "健康、户外" },
  "🎨 活力年轻": { a1: "#E91E63", a2: "#9C27B0", bg: "#FFFFFF", for: "时尚、潮流" },
  "🔷 现代简约": { a1: "#2196F3", a2: "#607D8B", bg: "#F5F5F5", for: "科技、简约" },
  "🔥 热情活力": { a1: "#FF9800", a2: "#F44336", bg: "#FFFFFF", for: "运动、激情" },
};

const DEFAULT_SETTINGS = {
  apiKey: "", customApiBase: "", selectedModel: "nano-banana-pro", defaultAspectRatio: "16:9",
  defaultResolution: "1K", imageFolder: "nano-banana-images", theme: "dark", colorPreset: "💙 科技蓝调",
};

// ==================== Plugin ====================
class NanoBananaPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new NanoBananaView(leaf, this));
    this.addRibbonIcon("image-plus", "Nano Banana 🍌", () => this.activateView());
    this.addCommand({ id: "open-nano-banana", name: "打开 Nano Banana 🍌 手绘信息图生成器", callback: () => this.activateView() });
    this.addCommand({
      id: "generate-from-note",
      name: "从当前笔记生成手绘信息图",
      editorCallback: (editor, view) => {
        const file = view.file;
        if (file) this.activateView().then(v => { if (v) v.startWithFile(file); });
      },
    });
    this.addSettingTab(new NanoBananaSettingTab(this.app, this));
  }
  onunload() {}
  async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }
  async saveSettings() { await this.saveData(this.settings); }
  async activateView() {
    const ws = this.app.workspace;
    let leaf = ws.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) { const r = ws.getRightLeaf(false); if (r) { await r.setViewState({ type: VIEW_TYPE, active: true }); leaf = r; } }
    if (leaf) { ws.revealLeaf(leaf); return leaf.view; }
    return null;
  }
}

// ==================== Wizard View ====================
class NanoBananaView extends obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentStep = 0; // 0=welcome, 1=select doc, 2=style, 3=analyze, 4=generate, 5=done
    this.selectedFile = null;
    this.docContent = "";
    this.imageCount = 1;
    this.imagePlan = []; // [{title, prompt}]
    this.generatedImages = []; // [{base64, text}]
    this.chatHistory = [];
  }
  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return "Nano Banana 🍌"; }
  getIcon() { return "image-plus"; }
  async onOpen() { this.renderStep(); }
  async onClose() { this.contentEl.empty(); }

  startWithFile(file) {
    this.selectedFile = file;
    this.currentStep = 2; // skip to style selection
    this.loadDocContent().then(() => this.renderStep());
  }

  async loadDocContent() {
    if (this.selectedFile) {
      this.docContent = await this.app.vault.cachedRead(this.selectedFile);
    }
  }

  // ==================== Step Router ====================
  renderStep() {
    const c = this.contentEl;
    c.empty();
    c.addClass("nano-banana-container");

    // Header
    const hdr = c.createDiv("nb-wizard-header");
    hdr.createEl("h4").textContent = "🍌 Nano Banana 手绘信息图";
    const restartBtn = hdr.createEl("button", { cls: "nb-restart-btn", text: "🔄 重新开始" });
    restartBtn.addEventListener("click", () => this.restart());

    // Progress bar
    if (this.currentStep > 0) {
      const steps = ["选择文档", "选择风格", "AI 分析", "生成图片", "完成"];
      const prog = c.createDiv("nb-progress");
      steps.forEach((name, i) => {
        const dot = prog.createDiv("nb-progress-step");
        dot.createDiv("nb-step-dot").textContent = i + 1;
        dot.createDiv("nb-step-label").textContent = name;
        if (i + 1 < this.currentStep) dot.addClass("done");
        if (i + 1 === this.currentStep) dot.addClass("active");
      });
    }

    const body = c.createDiv("nb-wizard-body");

    switch (this.currentStep) {
      case 0: this.renderWelcome(body); break;
      case 1: this.renderStep1_SelectDoc(body); break;
      case 2: this.renderStep2_Style(body); break;
      case 3: this.renderStep3_Analyze(body); break;
      case 4: this.renderStep4_Generate(body); break;
      case 5: this.renderStep5_Done(body); break;
    }
  }

  restart() {
    this.currentStep = 0;
    this.selectedFile = null;
    this.docContent = "";
    this.imageCount = 1;
    this.imagePlan = [];
    this.generatedImages = [];
    this.chatHistory = [];
    this.renderStep();
  }

  // ==================== Step 0: Welcome ====================
  renderWelcome(body) {
    const w = body.createDiv("nb-welcome");
    w.createEl("div", { cls: "nb-welcome-icon", text: "🍌" });
    w.createEl("h3", { text: "手绘信息图生成器" });
    w.createEl("p", { cls: "nb-welcome-desc", text: "选择一篇笔记，自动生成手绘涂鸦风格的信息图。" });

    if (!this.plugin.settings.apiKey) {
      const warn = w.createDiv("nb-warning");
      warn.textContent = "⚠️ 请先在插件设置中填写 Google Gemini API Key";
      return;
    }

    const startBtn = w.createEl("button", { cls: "nb-primary-btn", text: "开始创作 →" });
    startBtn.addEventListener("click", () => { this.currentStep = 1; this.renderStep(); });
  }

  // ==================== Step 1: Select Document ====================
  renderStep1_SelectDoc(body) {
    const s = body.createDiv("nb-step-content");
    s.createEl("h3", { text: "📄 Step 1: 选择文档" });
    s.createEl("p", { cls: "nb-step-desc", text: "选择一篇 vault 中的笔记作为文案内容" });

    // Search input
    const searchRow = s.createDiv("nb-search-row");
    const searchInput = searchRow.createEl("input", {
      cls: "nb-search-input",
      attr: { type: "text", placeholder: "🔍 搜索笔记名称..." },
    });

    // File list
    const listContainer = s.createDiv("nb-file-list");
    const files = this.app.vault.getMarkdownFiles().sort((a, b) => b.stat.mtime - a.stat.mtime);

    const renderFileList = (filter) => {
      listContainer.empty();
      const filtered = filter
        ? files.filter(f => f.basename.toLowerCase().includes(filter.toLowerCase()))
        : files.slice(0, 30);

      if (filtered.length === 0) {
        listContainer.createDiv({ cls: "nb-empty", text: "没有找到匹配的笔记" });
        return;
      }

      filtered.slice(0, 30).forEach(file => {
        const item = listContainer.createDiv("nb-file-item");
        if (this.selectedFile && this.selectedFile.path === file.path) item.addClass("selected");

        item.createDiv({ cls: "nb-file-name", text: file.basename });
        const pathText = file.parent?.path || "/";
        item.createDiv({ cls: "nb-file-path", text: pathText });

        item.addEventListener("click", () => {
          listContainer.querySelectorAll(".nb-file-item").forEach(el => el.removeClass("selected"));
          item.addClass("selected");
          this.selectedFile = file;
          nextBtn.disabled = false;
          nextBtn.textContent = "下一步：选择风格 →";
        });
      });
    };

    renderFileList("");
    searchInput.addEventListener("input", () => renderFileList(searchInput.value));

    // Or paste text directly
    const divider = s.createDiv("nb-divider");
    divider.createEl("span", { text: "或者直接粘贴文案" });

    const pasteArea = s.createEl("textarea", {
      cls: "nb-paste-area",
      attr: { placeholder: "在这里粘贴你的文案内容...", rows: 4 },
    });
    pasteArea.addEventListener("input", () => {
      if (pasteArea.value.trim()) {
        this.selectedFile = null;
        this.docContent = pasteArea.value.trim();
        listContainer.querySelectorAll(".nb-file-item").forEach(el => el.removeClass("selected"));
        nextBtn.disabled = false;
        nextBtn.textContent = "下一步：选择风格 →";
      }
    });

    // Next button
    const nextBtn = s.createEl("button", { cls: "nb-primary-btn", text: "请先选择文档" });
    nextBtn.disabled = true;
    nextBtn.addEventListener("click", async () => {
      if (this.selectedFile) await this.loadDocContent();
      if (!this.docContent.trim()) { new obsidian.Notice("文档内容为空"); return; }
      this.currentStep = 2;
      this.renderStep();
    });
  }

  // ==================== Step 2: Style ====================
  renderStep2_Style(body) {
    const s = body.createDiv("nb-step-content");
    s.createEl("h3", { text: "🎨 Step 2: 选择风格" });

    // Doc preview
    const preview = s.createDiv("nb-doc-preview");
    const previewTitle = this.selectedFile ? this.selectedFile.basename : "粘贴的文案";
    preview.createDiv({ cls: "nb-preview-title", text: "📄 " + previewTitle });
    const previewText = preview.createDiv("nb-preview-text");
    previewText.textContent = this.docContent.substring(0, 200) + (this.docContent.length > 200 ? "..." : "");

    // Model selection
    const modelSection = s.createDiv("nb-option-section");
    modelSection.createDiv({ cls: "nb-option-label", text: "模型" });
    const modelRow = modelSection.createDiv("nb-model-selector");
    for (const [key, model] of Object.entries(MODELS)) {
      const btn = modelRow.createEl("button", { cls: "nb-model-btn" });
      btn.textContent = model.name;
      btn.title = model.desc;
      if (this.plugin.settings.selectedModel === key) btn.addClass("active");
      btn.addEventListener("click", () => {
        modelRow.querySelectorAll(".nb-model-btn").forEach(b => b.removeClass("active"));
        btn.addClass("active");
        this.plugin.settings.selectedModel = key;
      });
    }

    // Aspect ratio
    const ratioSection = s.createDiv("nb-option-section");
    ratioSection.createDiv({ cls: "nb-option-label", text: "图片比例" });
    const ratioGrid = ratioSection.createDiv("nb-chip-grid");
    ["16:9", "4:3", "1:1", "9:16", "3:4"].forEach(r => {
      const chip = ratioGrid.createEl("button", { cls: "nb-chip" });
      chip.textContent = r;
      if (this.plugin.settings.defaultAspectRatio === r) chip.addClass("active");
      chip.addEventListener("click", () => {
        ratioGrid.querySelectorAll(".nb-chip").forEach(c => c.removeClass("active"));
        chip.addClass("active");
        this.plugin.settings.defaultAspectRatio = r;
      });
    });

    // Resolution
    const resSection = s.createDiv("nb-option-section");
    resSection.createDiv({ cls: "nb-option-label", text: "分辨率" });
    const resGrid = resSection.createDiv("nb-chip-grid");
    RESOLUTIONS.forEach(r => {
      const chip = resGrid.createEl("button", { cls: "nb-chip" });
      chip.textContent = r;
      if (this.plugin.settings.defaultResolution === r) chip.addClass("active");
      chip.addEventListener("click", () => {
        resGrid.querySelectorAll(".nb-chip").forEach(c => c.removeClass("active"));
        chip.addClass("active");
        this.plugin.settings.defaultResolution = r;
      });
    });

    // Theme (dark/light)
    const themeSection = s.createDiv("nb-option-section");
    themeSection.createDiv({ cls: "nb-option-label", text: "主题方案" });
    const themeGrid = themeSection.createDiv("nb-chip-grid");
    [{ v: "dark", t: "🌙 暗色背景+白字" }, { v: "light", t: "☀️ 白色背景+黑字" }].forEach(opt => {
      const chip = themeGrid.createEl("button", { cls: "nb-chip nb-chip-wide" });
      chip.textContent = opt.t;
      if (this.plugin.settings.theme === opt.v) chip.addClass("active");
      chip.addEventListener("click", () => {
        themeGrid.querySelectorAll(".nb-chip").forEach(c => c.removeClass("active"));
        chip.addClass("active");
        this.plugin.settings.theme = opt.v;
        updateColorPresets();
      });
    });

    // Color presets
    const colorSection = s.createDiv("nb-option-section");
    colorSection.createDiv({ cls: "nb-option-label", text: "配色方案" });
    const colorGrid = colorSection.createDiv("nb-color-grid");

    const updateColorPresets = () => {
      colorGrid.empty();
      const presets = this.plugin.settings.theme === "dark" ? PRESETS_DARK : PRESETS_LIGHT;
      for (const [name, p] of Object.entries(presets)) {
        const card = colorGrid.createDiv("nb-color-card");
        if (this.plugin.settings.colorPreset === name) card.addClass("active");

        const swatches = card.createDiv("nb-color-swatches");
        const s1 = swatches.createDiv("nb-swatch"); s1.style.background = p.a1;
        const s2 = swatches.createDiv("nb-swatch"); s2.style.background = p.a2;

        card.createDiv({ cls: "nb-color-name", text: name });
        card.createDiv({ cls: "nb-color-for", text: p.for });

        card.addEventListener("click", () => {
          colorGrid.querySelectorAll(".nb-color-card").forEach(c => c.removeClass("active"));
          card.addClass("active");
          this.plugin.settings.colorPreset = name;
        });
      }
    };
    updateColorPresets();

    // Navigation
    const nav = s.createDiv("nb-nav-row");
    const backBtn = nav.createEl("button", { cls: "nb-secondary-btn", text: "← 返回" });
    backBtn.addEventListener("click", () => { this.currentStep = 1; this.renderStep(); });
    const nextBtn = nav.createEl("button", { cls: "nb-primary-btn", text: "下一步：AI 分析 →" });
    nextBtn.addEventListener("click", () => {
      this.plugin.saveSettings();
      this.currentStep = 3;
      this.renderStep();
    });
  }

  // ==================== Step 3: AI Analyze ====================
  renderStep3_Analyze(body) {
    const s = body.createDiv("nb-step-content");
    s.createEl("h3", { text: "📊 Step 3: AI 分析配图" });

    const statusEl = s.createDiv("nb-analyze-status");

    // Parse 【配图】markers from document
    const markers = this.parseImageMarkers();

    if (markers.length === 0) {
      statusEl.textContent = "🍌 未找到配图标记，AI 正在自动分析文案内容...";

      const resultArea = s.createDiv("nb-analyze-result");
      resultArea.style.display = "none";

      this.autoAnalyzeContent().then(plan => {
        statusEl.textContent = `✅ AI 智能规划了 ${plan.length} 张配图：`;
        resultArea.style.display = "block";

        plan.forEach((img, i) => {
          const card = resultArea.createDiv("nb-plan-card");
          card.createDiv({ cls: "nb-plan-num", text: "配图 " + img.label });
          card.createDiv({ cls: "nb-plan-title", text: img.title });
          card.createDiv({ cls: "nb-plan-desc", text: img.description });
          card.createDiv({ cls: "nb-plan-desc", text: "要点：" + img.points.join(" | ") });
          if (img.icons && img.icons.length) {
            card.createDiv({ cls: "nb-plan-icons", text: "图标：" + img.icons.join("、") });
          }
        });

        this.imagePlan = plan;
        this.imageCount = plan.length;

        // Image count selector
        const countSection = resultArea.createDiv("nb-option-section");
        countSection.style.marginTop = "12px";
        countSection.createDiv({ cls: "nb-option-label", text: "生成数量（可自由调整）" });
        const countRow = countSection.createDiv("nb-chip-grid");
        const countInput = countSection.createEl("input", {
          cls: "nb-count-input",
          attr: { type: "number", min: "1", max: "10", value: String(plan.length) },
        });
        countInput.style.cssText = "width:60px;text-align:center;padding:6px 8px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);font-size:14px;margin-right:8px";
        const countHint = countSection.createEl("span", { cls: "nb-count-hint", text: `AI 建议 ${plan.length} 张，你可以改成任意数量` });
        countHint.style.cssText = "font-size:12px;color:var(--text-muted)";

        countInput.addEventListener("input", () => {
          let val = parseInt(countInput.value) || 1;
          if (val < 1) val = 1;
          if (val > 10) val = 10;
          this.imageCount = val;
          genBtn.textContent = "🍌 开始生成 " + val + " 张图片";
        });

        const nav = resultArea.createDiv("nb-nav-row");
        const backBtn = nav.createEl("button", { cls: "nb-secondary-btn", text: "← 修改风格" });
        backBtn.addEventListener("click", () => { this.currentStep = 2; this.renderStep(); });
        const genBtn = nav.createEl("button", { cls: "nb-primary-btn nb-generate-btn", text: "🍌 开始生成 " + plan.length + " 张图片" });
        genBtn.addEventListener("click", () => {
          // If user wants more than AI planned, pad imagePlan with extra entries
          while (this.imagePlan.length < this.imageCount) {
            const idx = this.imagePlan.length;
            const labels = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩"];
            this.imagePlan.push({
              label: labels[idx] || String(idx + 1),
              title: `补充配图${idx + 1}`,
              description: "根据文章内容自动生成补充信息图",
              points: ["核心要点"],
              icons: ["灯泡", "星星"],
              marker: null,
            });
          }
          this.currentStep = 4;
          this.renderStep();
        });
      }).catch(err => {
        statusEl.textContent = "❌ 自动分析失败: " + err.message;
        const nav = s.createDiv("nb-nav-row");
        const backBtn = nav.createEl("button", { cls: "nb-secondary-btn", text: "← 返回" });
        backBtn.addEventListener("click", () => { this.currentStep = 2; this.renderStep(); });
        const retryBtn = nav.createEl("button", { cls: "nb-primary-btn", text: "🔄 重试" });
        retryBtn.addEventListener("click", () => this.renderStep());
      });
      return;
    }

    statusEl.textContent = `🍌 找到 ${markers.length} 个配图标记，正在提炼关键词...`;

    const resultArea = s.createDiv("nb-analyze-result");
    resultArea.style.display = "none";

    // Use AI to distill each marker description into short keywords for infographic
    this.distillMarkers(markers).then(plan => {
      statusEl.textContent = `✅ 共 ${plan.length} 张配图，已提炼关键词：`;
      resultArea.style.display = "block";

      plan.forEach((img, i) => {
        const card = resultArea.createDiv("nb-plan-card");
        card.createDiv({ cls: "nb-plan-num", text: "配图 " + img.label });
        card.createDiv({ cls: "nb-plan-title", text: img.title });
        card.createDiv({ cls: "nb-plan-desc", text: "要点：" + img.points.join(" | ") });
        if (img.icons && img.icons.length) {
          card.createDiv({ cls: "nb-plan-icons", text: "图标：" + img.icons.join("、") });
        }
        card.createDiv({ cls: "nb-plan-heading", text: "📍 替换位置：「" + img.marker.substring(0, 30) + "...」" });
      });

      this.imagePlan = plan;
      this.imageCount = plan.length;

      // Navigation
      const nav = resultArea.createDiv("nb-nav-row");
      const backBtn = nav.createEl("button", { cls: "nb-secondary-btn", text: "← 修改风格" });
      backBtn.addEventListener("click", () => { this.currentStep = 2; this.renderStep(); });
      const genBtn = nav.createEl("button", { cls: "nb-primary-btn nb-generate-btn", text: "🍌 开始生成 " + this.imageCount + " 张图片" });
      genBtn.addEventListener("click", () => {
        this.currentStep = 4;
        this.renderStep();
      });
    }).catch(err => {
      statusEl.textContent = "❌ 提炼失败: " + err.message;
      const retryBtn = s.createEl("button", { cls: "nb-secondary-btn", text: "重试" });
      retryBtn.addEventListener("click", () => this.renderStep());
      // Fallback: use raw marker descriptions
      const skipBtn = s.createEl("button", { cls: "nb-primary-btn", text: "跳过提炼，直接用原始描述生成" });
      skipBtn.style.marginLeft = "8px";
      skipBtn.addEventListener("click", () => {
        this.imagePlan = markers.map(m => ({
          label: m.label, title: m.description.substring(0, 8), description: m.description,
          points: [m.description], icons: ["灯泡", "星星"], marker: m.fullMatch,
        }));
        this.imageCount = markers.length;
        this.currentStep = 4;
        this.renderStep();
      });
    });
  }

  // Parse 【配图①：description】 markers from document
  parseImageMarkers() {
    const regex = /【配图([①②③④⑤⑥⑦⑧⑨⑩\d]+)[：:]([^】]+)】/g;
    const markers = [];
    let match;
    while ((match = regex.exec(this.docContent)) !== null) {
      markers.push({
        label: match[1],
        description: match[2].trim(),
        fullMatch: match[0],
        index: match.index,
      });
    }
    return markers;
  }

  // Use AI to distill marker descriptions into concise keywords for infographic
  async distillMarkers(markers) {
    const settings = this.plugin.settings;
    const modelId = "gemini-3-pro-preview";
    const url = buildUrl(settings, modelId);

    const markerList = markers.map((m, i) => `配图${m.label}：${m.description}`).join("\n");

    const prompt = `你是信息图内容提炼专家。以下是文章中标记的配图描述，请为每张图提炼出适合手绘信息图的极简内容。

核心规则：
1. 每张图提炼出：一个简短标题（8字以内）+ 3-5个关键要点
2. 【重要】每个要点必须是精炼的关键词或短句（10字以内），不要照搬原始描述
3. 要点是核心概念、关键数据、动作短语，例如："11个AI员工"、"自动化流水线"、"知识库驱动"
4. 建议适合的手绘图标（如：灯泡、火箭、齿轮、笑脸、人物、电脑等）

配图描述：
${markerList}

请严格按以下 JSON 格式回复（数组长度=${markers.length}），不要包含其他内容：
[{"title": "简短标题", "points": ["要点1", "要点2", "要点3"], "icons": ["图标1", "图标2"]}]`;

    const resp = await obsidian.requestUrl({
      url,
      method: "POST",
      headers: buildHeaders(settings),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt + "\n\n【重要】直接输出JSON数组，不要输出任何思考过程、解释或markdown格式。" }] }],
      }),
    });

    if (resp.status >= 400) throw new Error("API " + resp.status);
    const result = resp.json;
    // Collect all text parts (skip thinking/reasoning parts)
    let allText = "";
    for (const part of result.candidates?.[0]?.content?.parts || []) {
      if (part.text) allText += part.text;
    }
    if (!allText) throw new Error("无分析结果");

    const jsonMatch = allText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("无法提取JSON: " + allText.substring(0, 200));
    const arr = JSON.parse(jsonMatch[0]);

    // Merge AI distilled content with original markers
    return markers.map((m, i) => ({
      label: m.label,
      title: arr[i]?.title || m.description.substring(0, 8),
      description: m.description,
      points: arr[i]?.points || [m.description],
      icons: arr[i]?.icons || ["灯泡", "星星"],
      marker: m.fullMatch,  // original marker text for replacement
    }));
  }

  // Use AI to auto-analyze content and plan images when no markers found
  async autoAnalyzeContent() {
    const settings = this.plugin.settings;
    const modelId = "gemini-3-pro-preview";
    const url = buildUrl(settings, modelId);

    // Truncate content to avoid token limits
    const content = this.docContent.substring(0, 6000);

    const prompt = `你是一位专业的信息图内容策划师。以下是一篇文章，请分析文章内容，规划出最适合制作手绘信息图的关键位置。

核心规则：
1. 根据文章长度规划配图数量：短文（<1000字）1-2张，中等（1000-2000字）2-3张，长文（>2000字）3-5张
2. 优先选择：核心观点、对比关系、流程步骤、数据展示、系统架构等适合可视化的内容
3. 每张图提炼：一个简短标题（8字以内）+ 3-5个关键要点（每个10字以内）
4. 建议适合的手绘图标（如：灯泡、火箭、齿轮、笑脸、人物、电脑等）
5. 提供一句简短的图片描述，说明这张图要表达什么

文章内容：
${content}

请严格按以下 JSON 格式回复，不要包含其他内容：
[{"title": "简短标题", "description": "这张图要表达什么", "points": ["要点1", "要点2", "要点3"], "icons": ["图标1", "图标2"]}]`;

    const resp = await obsidian.requestUrl({
      url,
      method: "POST",
      headers: buildHeaders(settings),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt + "\n\n【重要】直接输出JSON数组，不要输出任何思考过程、解释或markdown格式。" }] }],
      }),
    });

    if (resp.status >= 400) throw new Error("API " + resp.status);
    const result = resp.json;
    let allText = "";
    for (const part of result.candidates?.[0]?.content?.parts || []) {
      if (part.text) allText += part.text;
    }
    if (!allText) throw new Error("无分析结果");

    const jsonMatch = allText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("无法提取JSON: " + allText.substring(0, 200));
    const arr = JSON.parse(jsonMatch[0]);

    const labels = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩"];
    return arr.map((item, i) => ({
      label: labels[i] || String(i + 1),
      title: item.title || `图片${i + 1}`,
      description: item.description || item.title,
      points: item.points || ["要点"],
      icons: item.icons || ["灯泡", "星星"],
      marker: null,  // no marker to replace
    }));
  }

  // ==================== Step 4: Generate Images ====================
  renderStep4_Generate(body) {
    const s = body.createDiv("nb-step-content");
    s.createEl("h3", { text: "🍌 Step 4: 生成图片" });

    const progressText = s.createDiv("nb-gen-progress");
    const imageContainer = s.createDiv("nb-gen-images");

    this.generatedImages = [];
    this.renderImageCards(progressText, imageContainer, s);
  }

  renderImageCards(progressEl, container, parentEl) {
    const total = Math.min(this.imageCount, this.imagePlan.length);
    progressEl.textContent = `共 ${total} 张图片，逐张生成：`;

    const cardRefs = []; // store references for sequential generation

    for (let i = 0; i < total; i++) {
      const plan = this.imagePlan[i];
      const card = container.createDiv("nb-gen-card");
      card.createDiv({ cls: "nb-gen-card-title", text: `配图${plan.label || (i + 1)}: ${plan.title}` });
      if (plan.description) {
        card.createDiv({ cls: "nb-plan-desc", text: plan.description });
      }
      card.createDiv({ cls: "nb-plan-desc", text: "要点：" + (plan.points || []).join(" | ") });

      // Per-image instruction input
      const instrInput = card.createEl("textarea", {
        cls: "nb-paste-area",
        attr: { placeholder: "针对这张图的额外指令（可选），如：画成流程图、加对比箭头...", rows: 2 },
      });
      instrInput.style.cssText = "width:100%;margin:8px 0;padding:8px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);font-size:12px;resize:vertical";

      const btnRow = card.createDiv("nb-gen-actions");
      const genBtn = btnRow.createEl("button", { cls: "nb-primary-btn", text: "🍌 生成这张" });
      const imgArea = card.createDiv("nb-gen-img-area");

      cardRefs.push({ plan, card, instrInput, genBtn, imgArea, index: i });

      // 用闭包变量记录"是否已经生成过图片"以及已渲染的 imgEl，
      // 避免之前用 onclick + addEventListener 双重注册导致点一次跑两次（每次重试烧 2 次 API 配额）
      let existingImgEl = null;

      genBtn.addEventListener("click", async () => {
        if (genBtn.disabled) return; // 防抖：进行中再点一次直接忽略

        const userInstr = instrInput.value.trim();
        const isRetry = existingImgEl !== null;

        genBtn.disabled = true;
        genBtn.textContent = isRetry ? "⏳ 重试中..." : "⏳ 生成中...";
        instrInput.disabled = true;

        let loadingEl = null;
        if (isRetry) {
          // 重试：保留旧图，半透明提示正在生成
          existingImgEl.style.opacity = "0.3";
        } else {
          // 首次生成：显示加载动画
          loadingEl = imgArea.createDiv("nb-loading");
          const dots = loadingEl.createDiv("nb-loading-dots");
          dots.createDiv("nb-loading-dot"); dots.createDiv("nb-loading-dot"); dots.createDiv("nb-loading-dot");
          loadingEl.createDiv({ cls: "nb-loading-text", text: "生成中..." });
        }

        try {
          const result = await this.generateSingleImage(plan, i, userInstr);
          if (loadingEl) loadingEl.remove();

          if (result.image) {
            if (isRetry) {
              existingImgEl.src = "data:image/png;base64," + result.image;
              existingImgEl.style.opacity = "1";
            } else {
              const imgEl = imgArea.createEl("img", { cls: "nb-gen-img" });
              imgEl.src = "data:image/png;base64," + result.image;
              imgEl.addEventListener("click", () => new ImageModal(this.app, result.image).open());
              if (result.text) imgArea.createDiv({ cls: "nb-gen-text", text: result.text });
              existingImgEl = imgEl;
            }

            this.generatedImages[i] = result;
            genBtn.textContent = "🔄 重新生成";
            genBtn.disabled = false;
            instrInput.disabled = false;
          } else {
            if (isRetry && existingImgEl) existingImgEl.style.opacity = "1";
            imgArea.createDiv({ cls: "nb-gen-error", text: "❌ 生成失败: " + (result.text || "未知错误") });
            genBtn.textContent = isRetry ? "🔄 重新生成" : "🔄 重试";
            genBtn.disabled = false;
            instrInput.disabled = false;
          }
        } catch (err) {
          if (loadingEl) loadingEl.remove();
          if (isRetry && existingImgEl) existingImgEl.style.opacity = "1";
          imgArea.createDiv({ cls: "nb-gen-error", text: "❌ " + err.message });
          genBtn.textContent = isRetry ? "🔄 重新生成" : "🔄 重试";
          genBtn.disabled = false;
          instrInput.disabled = false;
        }

        // Update progress
        const doneCount = this.generatedImages.filter(Boolean).length;
        progressEl.textContent = `已完成 ${doneCount}/${total} 张`;
      });
    }

    // Batch generate all button
    const batchRow = container.createDiv("nb-nav-row");
    batchRow.style.marginTop = "12px";
    const batchBtn = batchRow.createEl("button", { cls: "nb-primary-btn nb-generate-btn", text: "🍌 一键生成全部 " + total + " 张" });
    batchBtn.addEventListener("click", async () => {
      batchBtn.disabled = true;
      batchBtn.textContent = "⏳ 批量生成中...";
      for (const ref of cardRefs) {
        if (!this.generatedImages[ref.index]) {
          ref.genBtn.click();
          // Wait for generation to complete
          await new Promise(resolve => {
            const check = setInterval(() => {
              if (this.generatedImages[ref.index] || ref.genBtn.textContent.includes("重试")) {
                clearInterval(check);
                resolve();
              }
            }, 500);
          });
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      batchBtn.textContent = "✅ 全部完成";
    });

    // Navigation
    const nav = parentEl.createDiv("nb-nav-row");
    const backBtn = nav.createEl("button", { cls: "nb-secondary-btn", text: "← 重新分析" });
    backBtn.addEventListener("click", () => { this.currentStep = 3; this.renderStep(); });
    const saveBtn = nav.createEl("button", { cls: "nb-primary-btn nb-generate-btn", text: "💾 保存全部到 Vault →" });
    saveBtn.addEventListener("click", () => {
      if (this.generatedImages.filter(Boolean).length === 0) {
        new obsidian.Notice("还没有生成任何图片");
        return;
      }
      this.currentStep = 5;
      this.renderStep();
    });
  }

  async generateSingleImage(plan, index, userInstruction) {
    const s = this.plugin.settings;
    const presets = s.theme === "dark" ? PRESETS_DARK : PRESETS_LIGHT;
    const p = presets[s.colorPreset] || Object.values(presets)[0];
    const isExcalidraw = !!p.excalidraw;

    // Build points text
    const points = plan.points || [plan.content || plan.description];
    const ratio = s.defaultAspectRatio || "16:9";

    let prompt;
    if (isExcalidraw) {
      // Excalidraw Whiteboard style with simple scene illustrations
      const textColor = s.theme === "dark" ? "白色" : "黑色";
      const bgColor = s.theme === "dark" ? "深色背景（#1E1E1E）" : "纯白色背景";
      const pointsText = points.map((pt, i) => `${i + 1}. ${pt}`).join("\n");

      prompt = `一张${ratio}的信息图，模仿 Excalidraw 白板手写风格，带有简笔画场景插图。

CRITICAL FONT STYLE - Excalidraw handwriting (MOST IMPORTANT):
- Every single text element must look like Excalidraw's "Virgil" handwriting font
- Letters must be wobbly, shaky, uneven, with visible tremor in every stroke
- Characters should vary in size, tilt at different angles, and have inconsistent spacing
- Strokes must look like someone drawing quickly with a slightly shaky hand on a whiteboard
- NOT neat, NOT calligraphic, NOT printed - must be MESSY and SCRATCHY like real whiteboard marker writing
- Think: a developer quickly sketching ideas on a whiteboard during a meeting
- Reference style: Excalidraw.com default handwriting font

字体强调：${textColor}手写体，必须像 Excalidraw 的 Virgil 字体那样——每个笔画都在抖动，字间距不均匀，字体大小参差不齐，像有人拿着粗马克笔在白板上快速潦草地写。绝对不要工整的印刷体或书法字体。

线条风格：所有线条、框线、箭头都必须是 wobbly/shaky 的手绘线，像 Excalidraw 画出来的抖动线条
${bgColor}
只用黑白灰，不要彩色
禁止五角星、波浪线装饰、花哨图案

插图要求：
- 可以画简笔画小人物、简单场景来辅助表达内容，像漫画分镜有画面感
- 人物用火柴人或简笔画，表情用 :) :( 等
- 场景道具（电脑、手机、对话框等）都用 Excalidraw 抖动手绘风格
- 每张图最多1-2个小场景，插图和文字结合

标题："${plan.title}"，大号${textColor}手写字体（必须 wobbly shaky 风格）

内容要点：
${pointsText}

整体感觉：完全像在 Excalidraw.com 上用手画的草图。字体是最重要的——必须是那种抖动的、潦草的、不规则的 Excalidraw 手写风格。`;
    } else {
      // Standard colored style
      const pointsText = points.map((pt, i) => `${i + 1}. ${pt} - 编号用${i % 2 === 0 ? p.a1 : p.a2}色圆圈`).join("\n");

      if (s.theme === "dark") {
        prompt = `一张${ratio}的手绘信息图，深色背景（${p.bg}），极简涂鸦风格。

标题用大号白色手写字体呈现"${plan.title}"，字体有手写粗糙感和笔触纹理，略带倾斜，关键字用${p.a1}高亮。

内容区域用手写白色字体展示以下要点：
${pointsText}

风格要求：
- 装饰极少：整张图最多3-4个小装饰（小箭头、小圆点），仅作为要点之间的连接或点缀
- 禁止大量星星、波浪线、涂鸦图案铺满画面
- 大面积留白，画面干净简洁
- 以文字信息为主，装饰为辅
- 所有文字保持手写马克笔质感，笔画不规整
- 只展示关键词和短句，每个要点10字以内`;
      } else {
        prompt = `一张${ratio}的手绘信息图，白色背景（${p.bg}），极简涂鸦风格。

标题用大号黑色手写字体呈现"${plan.title}"，字体有手写粗糙感和笔触纹理，略带倾斜，关键字用${p.a1}高亮。

内容区域用手写黑色字体展示以下要点：
${pointsText}

风格要求：
- 装饰极少：整张图最多3-4个小装饰（小箭头、小圆点），仅作为要点之间的连接或点缀
- 禁止大量星星、波浪线、涂鸦图案铺满画面
- 大面积留白，画面干净简洁
- 以文字信息为主，装饰为辅
- 所有文字保持手写马克笔质感，笔画不规整
- 只展示关键词和短句，每个要点10字以内`;
      }
    }

    // Append user custom instruction if provided
    if (userInstruction) {
      prompt += `\n\n用户额外要求：${userInstruction}`;
    }

    const modelId = MODELS[s.selectedModel].id;
    const url = buildUrl(s, modelId);
    console.log('[Nano Banana] Request URL:', url);
    console.log('[Nano Banana] API Base:', getApiBase(s));
    console.log('[Nano Banana] Model ID:', modelId);

    const genConfig = { responseModalities: ["TEXT", "IMAGE"] };
    const imgCfg = {};
    if (s.defaultAspectRatio) imgCfg.aspectRatio = s.defaultAspectRatio;
    if (s.defaultResolution) imgCfg.imageSize = s.defaultResolution;
    if (Object.keys(imgCfg).length > 0) genConfig.imageConfig = imgCfg;

    const resp = await obsidian.requestUrl({
      url,
      method: "POST",
      headers: buildHeaders(s),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: genConfig,
      }),
    });

    if (resp.status >= 400) {
      const errText = typeof resp.json === 'object' ? JSON.stringify(resp.json) : resp.text;
      let msg; try { msg = JSON.parse(errText).error?.message; } catch { msg = (errText || '').substring(0, 200); }
      throw new Error("API " + resp.status + ": " + msg);
    }

    const result = resp.json;
    if (result.promptFeedback?.blockReason) throw new Error("BLOCKED: " + result.promptFeedback.blockReason);
    if (!result.candidates?.length) throw new Error("无候选结果");

    let text = "", image = null;
    for (const part of result.candidates[0].content?.parts || []) {
      if (part.text) text += part.text;
      if (part.inlineData?.data) image = part.inlineData.data;
      if (part.inline_data?.data) image = part.inline_data.data;
    }
    return { text, image };
  }

  // ==================== Step 5: Save ====================
  renderStep5_Done(body) {
    const s = body.createDiv("nb-step-content");
    s.createEl("h3", { text: "💾 Step 5: 保存图片" });

    const folder = this.plugin.settings.imageFolder;
    const successImages = this.generatedImages.filter(Boolean);

    const statusEl = s.createDiv("nb-save-status");
    statusEl.textContent = "正在保存 " + successImages.length + " 张图片...";

    const savedList = s.createDiv("nb-saved-list");

    this.saveAllImages(successImages, folder, statusEl, savedList).then(async (savedFiles) => {
      if (savedFiles.length === 0) {
        statusEl.textContent = "❌ 没有图片被保存";
        return;
      }

      // Auto-replace 【配图】markers in source document with image links
      if (this.selectedFile) {
        try {
          let content = await this.app.vault.read(this.selectedFile);
          let replaceCount = 0;

          for (let i = 0; i < savedFiles.length; i++) {
            const plan = this.imagePlan[i];
            if (plan && plan.marker && content.includes(plan.marker)) {
              content = content.replace(plan.marker, "![[" + savedFiles[i] + "]]");
              replaceCount++;
            }
          }

          if (replaceCount > 0) {
            await this.app.vault.modify(this.selectedFile, content);
            statusEl.textContent = "✅ 已保存 " + savedFiles.length + " 张图片，替换了「" + this.selectedFile.basename + "」中 " + replaceCount + " 个配图标记！";
          } else {
            statusEl.textContent = "✅ 图片已保存，但未找到可替换的配图标记";
          }
        } catch (e) {
          statusEl.textContent = "✅ 图片已保存，但替换文档失败: " + e.message;
          console.error("[Nano Banana] Replace error:", e);
        }
      } else {
        statusEl.textContent = "✅ 已保存 " + savedFiles.length + " 张图片！";
      }

      // Navigation
      const nav = s.createDiv("nb-nav-row");
      const newBtn = nav.createEl("button", { cls: "nb-secondary-btn", text: "🍌 生成新的" });
      newBtn.addEventListener("click", () => this.restart());

      if (this.selectedFile) {
        const openBtn = nav.createEl("button", { cls: "nb-primary-btn", text: "📄 打开文档查看" });
        openBtn.addEventListener("click", () => {
          this.app.workspace.openLinkText(this.selectedFile.path, "", false);
        });
      }

      // Also allow insert to a different (currently open) note
      if (savedFiles.length > 0) {
        const insertOtherBtn = s.createEl("button", { cls: "nb-secondary-btn", text: "📝 插入到当前打开的笔记末尾" });
        insertOtherBtn.style.marginTop = "8px";
        insertOtherBtn.addEventListener("click", () => {
          const av = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
          if (av) {
            const editor = av.editor;
            const text = savedFiles.map(f => "![[" + f + "]]").join("\n\n");
            editor.replaceRange("\n" + text + "\n", editor.getCursor());
            new obsidian.Notice("🍌 已插入 " + savedFiles.length + " 张图片");
          } else {
            new obsidian.Notice("请先打开一篇笔记");
          }
        });
      }
    });
  }

  async saveAllImages(images, folder, statusEl, listEl) {
    const vault = this.app.vault;
    if (!vault.getAbstractFileByPath(folder)) await vault.createFolder(folder);

    const savedFiles = [];
    const ts = Date.now();

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img || !img.image) continue;

      const fn = folder + "/nano-banana-" + ts + "-" + (i + 1) + ".png";
      try {
        await vault.createBinary(fn, Uint8Array.from(atob(img.image), c => c.charCodeAt(0)));
        savedFiles.push(fn);
        const item = listEl.createDiv("nb-saved-item");
        item.textContent = "✅ " + fn;
      } catch (e) {
        const item = listEl.createDiv("nb-saved-item nb-saved-error");
        item.textContent = "❌ " + fn + " - " + e.message;
      }
    }

    return savedFiles;
  }
}

// ==================== Modal ====================
class ImageModal extends obsidian.Modal {
  constructor(app, b64) { super(app); this.b64 = b64; }
  onOpen() {
    const el = this.contentEl; el.empty();
    el.style.cssText = "padding:0;display:flex;justify-content:center;align-items:center";
    const img = el.createEl("img");
    img.src = "data:image/png;base64," + this.b64;
    img.style.cssText = "max-width:90vw;max-height:85vh;border-radius:8px";
  }
  onClose() { this.contentEl.empty(); }
}

// ==================== Settings ====================
class NanoBananaSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const el = this.containerEl; el.empty();
    el.createEl("h2", { text: "🍌 Nano Banana 设置" });

    new obsidian.Setting(el).setName("Google Gemini API Key").setDesc("从 aistudio.google.com 获取")
      .addText(t => t.setPlaceholder("API Key").setValue(this.plugin.settings.apiKey)
        .onChange(async v => { this.plugin.settings.apiKey = v.trim(); await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("自定义 API 地址（可选）").setDesc("留空则使用 Google 官方地址。填 https://xxx.com 或 https://xxx.com/v1beta/models 都行，插件自动识别")
      .addText(t => t.setPlaceholder("https://generativelanguage.googleapis.com/v1beta/models").setValue(this.plugin.settings.customApiBase || "")
        .onChange(async v => { this.plugin.settings.customApiBase = v.trim(); await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("默认模型")
      .addDropdown(d => d.addOptions({ "nano-banana": "🍌 Flash (快速)", "nano-banana-pro": "🍌 Pro (高品质)" })
        .setValue(this.plugin.settings.selectedModel)
        .onChange(async v => { this.plugin.settings.selectedModel = v; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("图片保存文件夹")
      .addText(t => t.setPlaceholder("nano-banana-images").setValue(this.plugin.settings.imageFolder)
        .onChange(async v => { this.plugin.settings.imageFolder = v.trim() || "nano-banana-images"; await this.plugin.saveSettings(); }));

    el.createEl("h3", { text: "📖 使用说明" });
    el.createDiv().innerHTML = "<p>1. 点击左侧 🍌 图标或命令面板搜索 'Nano Banana'</p>" +
      "<p>2. 按照 5 步引导选择文档、风格、生成图片</p>" +
      "<p>3. 也可以在笔记中使用命令 '从当前笔记生成手绘信息图'</p>";
  }
}

module.exports = NanoBananaPlugin;
