/*
 * Web Clipper 📸 网页截图助手 v2.1.0
 * Obsidian 插件 - 自动解析【截图】和【录屏】标记，截取网页并替换到文章对应位置
 * 支持本地 Playwright 截图（可翻译英文页面）+ ScreenshotOne API 备选
 * v2.1.0: 支持 #offset=数字 参数，同一URL可截不同滚动位置
 */
"use strict";
const obsidian = require("obsidian");
const { exec } = require("child_process");
const nodePath = require("path");

const VIEW_TYPE = "web-clipper-view";

const DEFAULT_SETTINGS = {
  engine: "playwright",  // "playwright"(本地) 或 "api"(ScreenshotOne)
  apiKey: "",
  screenshotServerPath: "", // 自动检测
  imageFolder: "web-clipper-images",
  viewportWidth: 1280,
  viewportHeight: 720,
  format: "png",
  blockAds: true,
  blockCookieBanners: true,
  blockChats: true,
  fullPage: false,
  delay: 3,
  translateToZh: true, // 英文页面自动翻译为中文
  // Recording settings
  recordDuration: 15,
  recordFormat: "mp4",
  scrollDelay: 500,
  scrollDuration: 1500,
  scrollBy: 800,
};

// ==================== Plugin ====================
class WebClipperPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new WebClipperView(leaf, this));
    this.addRibbonIcon("camera", "Web Clipper 📸", () => this.activateView());
    this.addCommand({ id: "open-web-clipper", name: "打开 Web Clipper 📸 网页截图助手", callback: () => this.activateView() });
    this.addCommand({
      id: "clip-current-note",
      name: "截图当前笔记中的所有网页标记",
      editorCallback: (editor, view) => {
        const file = view.file;
        if (file) this.activateView().then(v => { if (v) v.startWithFile(file); });
      },
    });
    this.addSettingTab(new WebClipperSettingTab(this.app, this));
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

// ==================== View ====================
class WebClipperView extends obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentStep = 0;
    this.selectedFile = null;
    this.docContent = "";
    this.markers = [];
    this.screenshots = []; // [{base64, url, description}]
  }
  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return "Web Clipper 📸"; }
  getIcon() { return "camera"; }
  async onOpen() { this.renderStep(); }
  async onClose() { this.contentEl.empty(); }

  startWithFile(file) {
    this.selectedFile = file;
    this.loadDocContent().then(() => {
      this.currentStep = 2;
      this.renderStep();
    });
  }

  async loadDocContent() {
    if (this.selectedFile) {
      this.docContent = await this.app.vault.cachedRead(this.selectedFile);
    }
  }

  renderStep() {
    const c = this.contentEl;
    c.empty();
    c.addClass("wc-container");

    const hdr = c.createDiv("wc-header");
    hdr.createEl("h4").textContent = "📸 Web Clipper 网页截图";
    const restartBtn = hdr.createEl("button", { cls: "wc-restart-btn", text: "🔄 重新开始" });
    restartBtn.addEventListener("click", () => this.restart());

    if (this.currentStep > 0) {
      const steps = ["选择文档", "确认截图", "截图中", "完成"];
      const prog = c.createDiv("wc-progress");
      steps.forEach((name, i) => {
        const dot = prog.createDiv("wc-progress-step");
        dot.createDiv("wc-step-dot").textContent = i + 1;
        dot.createDiv("wc-step-label").textContent = name;
        if (i + 1 < this.currentStep) dot.addClass("done");
        if (i + 1 === this.currentStep) dot.addClass("active");
      });
    }

    const body = c.createDiv("wc-body");
    switch (this.currentStep) {
      case 0: this.renderWelcome(body); break;
      case 1: this.renderStep1_SelectDoc(body); break;
      case 2: this.renderStep2_Confirm(body); break;
      case 3: this.renderStep3_Capture(body); break;
      case 4: this.renderStep4_Done(body); break;
    }
  }

  restart() {
    this.currentStep = 0;
    this.selectedFile = null;
    this.docContent = "";
    this.markers = [];
    this.screenshots = [];
    this.renderStep();
  }

  // ==================== Step 0: Welcome ====================
  renderWelcome(body) {
    const w = body.createDiv("wc-welcome");
    w.createEl("div", { cls: "wc-welcome-icon", text: "📸" });
    w.createEl("h3", { text: "网页截图助手" });
    w.createEl("p", { cls: "wc-desc", text: "自动解析文章中的【截图①：URL，描述】标记，截取网页并替换到对应位置。" });

    if (this.plugin.settings.engine === "api" && !this.plugin.settings.apiKey) {
      const warn = w.createDiv("wc-warning");
      warn.innerHTML = "⚠️ 请先在插件设置中填写 ScreenshotOne API Key<br><small>免费注册：<a href='https://screenshotone.com'>screenshotone.com</a></small>";
      return;
    }

    const startBtn = w.createEl("button", { cls: "wc-primary-btn", text: "开始截图 →" });
    startBtn.addEventListener("click", () => { this.currentStep = 1; this.renderStep(); });
  }

  // ==================== Step 1: Select Document ====================
  renderStep1_SelectDoc(body) {
    const s = body.createDiv("wc-step-content");
    s.createEl("h3", { text: "📄 Step 1: 选择文档" });
    s.createEl("p", { cls: "wc-desc", text: "选择包含【截图】标记的笔记" });

    const searchRow = s.createDiv("wc-search-row");
    const searchInput = searchRow.createEl("input", {
      cls: "wc-search-input",
      attr: { type: "text", placeholder: "🔍 搜索笔记名称..." },
    });

    const listContainer = s.createDiv("wc-file-list");
    const files = this.app.vault.getMarkdownFiles().sort((a, b) => b.stat.mtime - a.stat.mtime);

    const renderFileList = (filter) => {
      listContainer.empty();
      const filtered = filter
        ? files.filter(f => f.basename.toLowerCase().includes(filter.toLowerCase()))
        : files.slice(0, 30);

      if (filtered.length === 0) {
        listContainer.createDiv({ cls: "wc-empty", text: "没有找到匹配的笔记" });
        return;
      }

      filtered.slice(0, 30).forEach(file => {
        const item = listContainer.createDiv("wc-file-item");
        if (this.selectedFile && this.selectedFile.path === file.path) item.addClass("selected");
        item.createDiv({ cls: "wc-file-name", text: file.basename });
        item.createDiv({ cls: "wc-file-path", text: file.parent?.path || "/" });
        item.addEventListener("click", () => {
          listContainer.querySelectorAll(".wc-file-item").forEach(el => el.removeClass("selected"));
          item.addClass("selected");
          this.selectedFile = file;
          nextBtn.disabled = false;
          nextBtn.textContent = "下一步：解析截图标记 →";
        });
      });
    };

    renderFileList("");
    searchInput.addEventListener("input", () => renderFileList(searchInput.value));

    const nextBtn = s.createEl("button", { cls: "wc-primary-btn", text: "请先选择文档" });
    nextBtn.disabled = true;
    nextBtn.addEventListener("click", async () => {
      await this.loadDocContent();
      if (!this.docContent.trim()) { new obsidian.Notice("文档内容为空"); return; }
      this.currentStep = 2;
      this.renderStep();
    });
  }

  // ==================== Step 2: Confirm Markers ====================
  renderStep2_Confirm(body) {
    const s = body.createDiv("wc-step-content");
    s.createEl("h3", { text: "🔍 Step 2: 确认截图列表" });

    this.markers = this.parseMarkers();

    if (this.markers.length === 0) {
      s.createDiv({ cls: "wc-warning", text: "⚠️ 文章中没有找到【截图】标记" });
      s.createEl("br");
      s.createDiv({ cls: "wc-desc", text: "请在文章中添加标记，格式：" });
      s.createEl("code").textContent = "【截图①：https://example.com ，页面描述】";
      const nav = s.createDiv("wc-nav-row");
      nav.createEl("button", { cls: "wc-secondary-btn", text: "← 返回" }).addEventListener("click", () => { this.currentStep = 1; this.renderStep(); });
      return;
    }

    const imgCount = this.markers.filter(m => m.type === "image").length;
    const scrollCount = this.markers.filter(m => m.type === "scroll").length;
    const stillCount = this.markers.filter(m => m.type === "still").length;
    const vidCount = scrollCount + stillCount;
    let summaryParts = [];
    if (imgCount > 0) summaryParts.push(`📸截图 ${imgCount}`);
    if (scrollCount > 0) summaryParts.push(`🎬录屏 ${scrollCount}`);
    if (stillCount > 0) summaryParts.push(`⏺️动录 ${stillCount}`);
    s.createDiv({ cls: "wc-plan-summary", text: `找到 ${this.markers.length} 个标记（${summaryParts.join(" + ")}）：` });

    // Settings panel
    const settingsPanel = s.createDiv("wc-settings-panel");
    settingsPanel.createDiv({ cls: "wc-option-label", text: "⚙️ 截图选项" });

    const optGrid = settingsPanel.createDiv("wc-opt-grid");

    // Full page toggle
    const fpRow = optGrid.createDiv("wc-opt-row");
    fpRow.createEl("span", { text: "整页截图" });
    const fpToggle = fpRow.createEl("input", { attr: { type: "checkbox" } });
    fpToggle.checked = this.plugin.settings.fullPage;
    fpToggle.addEventListener("change", () => { this.plugin.settings.fullPage = fpToggle.checked; });

    // Block ads toggle
    const adRow = optGrid.createDiv("wc-opt-row");
    adRow.createEl("span", { text: "屏蔽广告" });
    const adToggle = adRow.createEl("input", { attr: { type: "checkbox" } });
    adToggle.checked = this.plugin.settings.blockAds;
    adToggle.addEventListener("change", () => { this.plugin.settings.blockAds = adToggle.checked; });

    // Block cookies toggle
    const ckRow = optGrid.createDiv("wc-opt-row");
    ckRow.createEl("span", { text: "屏蔽 Cookie 弹窗" });
    const ckToggle = ckRow.createEl("input", { attr: { type: "checkbox" } });
    ckToggle.checked = this.plugin.settings.blockCookieBanners;
    ckToggle.addEventListener("change", () => { this.plugin.settings.blockCookieBanners = ckToggle.checked; });

    // Translate toggle
    const trRow = optGrid.createDiv("wc-opt-row");
    trRow.createEl("span", { text: "翻译英文" });
    const trToggle = trRow.createEl("input", { attr: { type: "checkbox" } });
    trToggle.checked = this.plugin.settings.translateToZh;
    trToggle.addEventListener("change", () => { this.plugin.settings.translateToZh = trToggle.checked; });

    // Delay
    const dlRow = optGrid.createDiv("wc-opt-row");
    dlRow.createEl("span", { text: "等待加载(秒)" });
    const dlInput = dlRow.createEl("input", { cls: "wc-num-input", attr: { type: "number", min: "0", max: "15", value: String(this.plugin.settings.delay) } });
    dlInput.addEventListener("change", () => { this.plugin.settings.delay = parseInt(dlInput.value) || 3; });

    // Recording settings (only show if there are video markers)
    if (vidCount > 0) {
      const recSection = s.createDiv("wc-settings-panel");
      recSection.createDiv({ cls: "wc-option-label", text: "🎬 录屏选项" });
      const recGrid = recSection.createDiv("wc-opt-grid");

      const durRow = recGrid.createDiv("wc-opt-row");
      durRow.createEl("span", { text: "录制时长(秒)" });
      const durInput = durRow.createEl("input", { cls: "wc-num-input", attr: { type: "number", min: "3", max: "30", value: String(this.plugin.settings.recordDuration) } });
      durInput.addEventListener("change", () => { this.plugin.settings.recordDuration = Math.min(30, Math.max(3, parseInt(durInput.value) || 15)); });

      const fmtRow = recGrid.createDiv("wc-opt-row");
      fmtRow.createEl("span", { text: "视频格式" });
      const fmtSel = fmtRow.createEl("select", { cls: "wc-num-input" });
      ["mp4", "gif", "webm"].forEach(f => { const o = fmtSel.createEl("option", { text: f, attr: { value: f } }); if (f === this.plugin.settings.recordFormat) o.selected = true; });
      fmtSel.addEventListener("change", () => { this.plugin.settings.recordFormat = fmtSel.value; });

      const spdRow = recGrid.createDiv("wc-opt-row");
      spdRow.createEl("span", { text: "滚动速度(ms)" });
      const spdInput = spdRow.createEl("input", { cls: "wc-num-input", attr: { type: "number", min: "300", max: "5000", value: String(this.plugin.settings.scrollDuration) } });
      spdInput.addEventListener("change", () => { this.plugin.settings.scrollDuration = parseInt(spdInput.value) || 1500; });

      const byRow = recGrid.createDiv("wc-opt-row");
      byRow.createEl("span", { text: "每次滚动(px)" });
      const byInput = byRow.createEl("input", { cls: "wc-num-input", attr: { type: "number", min: "200", max: "2000", value: String(this.plugin.settings.scrollBy) } });
      byInput.addEventListener("change", () => { this.plugin.settings.scrollBy = parseInt(byInput.value) || 800; });
    }

    // Marker list
    this.markers.forEach((m, i) => {
      const card = s.createDiv("wc-marker-card");
      const typeIcon = m.type === "scroll" ? "🎬" : m.type === "still" ? "⏺️" : "📸";
      const offsetInfo = m.scrollTo > 0 ? ` [offset=${m.scrollTo}px]` : "";
      card.createDiv({ cls: "wc-marker-label", text: `${typeIcon} ${m.prefix}${m.label}${offsetInfo}` });
      const urlEl = card.createDiv({ cls: "wc-marker-url" });
      urlEl.createEl("a", { text: m.url.substring(0, 60) + (m.url.length > 60 ? "..." : ""), attr: { href: m.url, target: "_blank" } });
      if (m.description) card.createDiv({ cls: "wc-marker-desc", text: m.description });
    });

    // Navigation
    const nav = s.createDiv("wc-nav-row");
    nav.createEl("button", { cls: "wc-secondary-btn", text: "← 返回" }).addEventListener("click", () => { this.currentStep = 1; this.renderStep(); });
    const captureBtn = nav.createEl("button", { cls: "wc-primary-btn wc-capture-btn", text: `📸 开始处理 (${this.markers.length} 个)` });
    captureBtn.addEventListener("click", () => {
      this.plugin.saveSettings();
      this.currentStep = 3;
      this.renderStep();
    });
  }

  parseMarkers() {
    // Match: 【截图①：URL，描述】【录屏①：URL，描述】【动录①：URL，描述】
    const regex = /【(截图|录屏|动录)([①②③④⑤⑥⑦⑧⑨⑩\d]+)[：:]\s*(https?:\/\/[^\s，,】]+)\s*[，,]?\s*([^】]*)】/g;
    const markers = [];
    let match;
    while ((match = regex.exec(this.docContent)) !== null) {
      let type = "image";
      if (match[1] === "录屏") type = "scroll";
      else if (match[1] === "动录") type = "still";
      // 解析 URL 中的 #offset=数字 参数（v2.1.0新增）
      let rawUrl = match[3].trim();
      let scrollTo = 0;
      const offsetMatch = rawUrl.match(/#offset=(\d+)/);
      if (offsetMatch) {
        scrollTo = parseInt(offsetMatch[1]) || 0;
        rawUrl = rawUrl.replace(/#offset=\d+/, '');
      }
      markers.push({
        type,
        label: match[2],
        prefix: match[1],
        url: rawUrl,
        scrollTo,
        description: match[4].trim(),
        fullMatch: match[0],
      });
    }
    return markers;
  }

  // ==================== Step 3: Capture ====================
  renderStep3_Capture(body) {
    const s = body.createDiv("wc-step-content");
    s.createEl("h3", { text: "📸 Step 3: 截图中" });

    const progressEl = s.createDiv("wc-progress-text");
    const container = s.createDiv("wc-screenshots");

    this.screenshots = [];
    this.captureAll(progressEl, container, s);
  }

  async captureAll(progressEl, container, parentEl) {
    const total = this.markers.length;

    for (let i = 0; i < total; i++) {
      const marker = this.markers[i];
      const isVideo = marker.type === "scroll" || marker.type === "still";
      const typeIcon = marker.type === "scroll" ? "🎬" : marker.type === "still" ? "⏺️" : "📸";
      const actionText = marker.type === "scroll" ? "滚动录屏中" : marker.type === "still" ? "动画录屏中" : "截图中";
      progressEl.textContent = `正在${actionText} ${i + 1}/${total}... ${typeIcon}`;

      const card = container.createDiv("wc-screenshot-card");
      card.createDiv({ cls: "wc-ss-title", text: `${typeIcon} ${marker.prefix}${marker.label}: ${marker.description || marker.url.substring(0, 40)}` });

      const loadingEl = card.createDiv("wc-loading");
      loadingEl.createDiv({ cls: "wc-loading-text", text: actionText + "... " + marker.url.substring(0, 50) + (isVideo ? " (可能需要30秒以上)" : "") });

      try {
        const result = isVideo
          ? await this.captureVideo(marker.url, marker.type === "scroll" ? "scroll" : "default")
          : await this.captureScreenshot(marker.url, marker.scrollTo);
        loadingEl.remove();

        if (result.base64) {
          if (isVideo) {
            // Video preview
            const videoEl = card.createEl("video", { cls: "wc-ss-img", attr: { controls: "", autoplay: "", loop: "", muted: "" } });
            videoEl.src = "data:video/" + (this.plugin.settings.recordFormat || "mp4") + ";base64," + result.base64;
          } else {
            // Image preview
            const imgEl = card.createEl("img", { cls: "wc-ss-img" });
            imgEl.src = "data:image/png;base64," + result.base64;
            imgEl.addEventListener("click", () => new ImageModal(this.app, result.base64).open());
          }

          const actions = card.createDiv("wc-ss-actions");
          const retryBtn = actions.createEl("button", { cls: "wc-small-btn", text: "🔄 重新" + (isVideo ? "录屏" : "截图") });
          retryBtn.addEventListener("click", async () => {
            retryBtn.disabled = true;
            retryBtn.textContent = "⏳ " + actionText + "...";
            try {
              const retry = isVideo
                ? await this.captureVideo(marker.url, marker.type === "scroll" ? "scroll" : "default")
                : await this.captureScreenshot(marker.url, marker.scrollTo);
              if (retry.base64) {
                this.screenshots[i] = retry;
                // Refresh card content
                const mediaEl = card.querySelector("img, video");
                if (mediaEl) {
                  if (isVideo) mediaEl.src = "data:video/" + (this.plugin.settings.recordFormat || "mp4") + ";base64," + retry.base64;
                  else mediaEl.src = "data:image/png;base64," + retry.base64;
                }
              }
            } catch (e) { new obsidian.Notice("重试失败: " + e.message); }
            retryBtn.disabled = false;
            retryBtn.textContent = "🔄 重新" + (isVideo ? "录屏" : "截图");
          });

          this.screenshots.push(result);
        } else {
          card.createDiv({ cls: "wc-ss-error", text: "❌ " + actionText + "失败" });
          this.screenshots.push(null);
        }
      } catch (err) {
        loadingEl.remove();
        card.createDiv({ cls: "wc-ss-error", text: "❌ " + err.message });
        this.screenshots.push(null);
      }

      if (i < total - 1) await new Promise(r => setTimeout(r, 1500));
    }

    const successCount = this.screenshots.filter(Boolean).length;
    progressEl.textContent = `✅ 完成！${successCount}/${total} 个成功`;

    const nav = parentEl.createDiv("wc-nav-row");
    nav.createEl("button", { cls: "wc-secondary-btn", text: "← 重新确认" }).addEventListener("click", () => { this.currentStep = 2; this.renderStep(); });

    if (successCount > 0) {
      const saveBtn = nav.createEl("button", { cls: "wc-primary-btn wc-capture-btn", text: "💾 保存并替换到文章 →" });
      saveBtn.addEventListener("click", () => { this.currentStep = 4; this.renderStep(); });
    }
  }

  // ==================== 截图引擎路由 ====================

  getServerPath() {
    const s = this.plugin.settings;
    if (s.screenshotServerPath) return s.screenshotServerPath;
    // 自动检测：vault 同级目录下的 wechat-title-scraper
    const vaultPath = this.app.vault.adapter.basePath;
    const candidates = [
      nodePath.join(vaultPath, "05.插件", "wechat-title-scraper", "screenshot-server.js"),
      nodePath.join(vaultPath, "..", "wechat-title-scraper", "screenshot-server.js"),
    ];
    for (const p of candidates) {
      try { require("fs").accessSync(p); return p; } catch {}
    }
    return "";
  }

  async captureScreenshot(url, scrollTo) {
    const s = this.plugin.settings;
    if (s.engine === "playwright") {
      return this.captureWithPlaywright(url, false, null, scrollTo || 0);
    }
    return this.captureWithApi(url, scrollTo || 0);
  }

  async captureVideo(url, scenario) {
    const s = this.plugin.settings;
    if (s.engine === "playwright") {
      return this.captureWithPlaywright(url, true, scenario, 0);
    }
    return this.captureVideoWithApi(url, scenario);
  }

  // ==================== 本地 Playwright 截图 ====================

  captureWithPlaywright(url, isVideo, scenario, scrollTo) {
    return new Promise((resolve, reject) => {
      const s = this.plugin.settings;
      const serverPath = this.getServerPath();
      if (!serverPath) {
        reject(new Error("找不到 screenshot-server.js，请在插件设置中指定路径"));
        return;
      }

      // 生成临时输出路径
      const vaultPath = this.app.vault.adapter.basePath;
      const ext = isVideo ? (s.recordFormat || "mp4") : "png";
      const tmpFile = nodePath.join(vaultPath, s.imageFolder, `_tmp_${Date.now()}.${ext}`);

      // 构建命令
      const args = [
        `"${serverPath}"`,
        `--url "${url}"`,
        `--output "${tmpFile}"`,
        `--width ${s.viewportWidth}`,
        `--height ${s.viewportHeight}`,
        `--delay ${s.delay}`,
      ];
      if (s.translateToZh) args.push("--translate");
      if (s.fullPage && !isVideo) args.push("--full-page");
      if (scrollTo > 0) args.push(`--scroll-to ${scrollTo}`);
      if (isVideo) {
        args.push(`--record ${scenario || "scroll"}`);
        args.push(`--duration ${s.recordDuration || 15}`);
      }

      const cmd = `node ${args.join(" ")}`;
      console.log("[Web Clipper] Playwright cmd:", cmd);

      exec(cmd, { timeout: 120000, maxBuffer: 50 * 1024 * 1024 }, async (error, stdout, stderr) => {
        if (stderr) console.log("[Web Clipper] stderr:", stderr);

        try {
          // 解析stdout中的JSON结果
          const lines = stdout.trim().split("\n");
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);

          if (!result.success) {
            reject(new Error(result.error || "Playwright 截图失败"));
            return;
          }

          // 读取文件转base64
          const fs = require("fs");
          const fileBuffer = fs.readFileSync(tmpFile);
          const base64 = fileBuffer.toString("base64");

          // 删除临时文件
          try { fs.unlinkSync(tmpFile); } catch {}

          resolve({
            base64,
            url,
            isVideo: isVideo || false
          });
        } catch (e) {
          reject(new Error("Playwright 结果解析失败: " + (e.message || "") + " stdout:" + stdout.substring(0, 200)));
        }
      });
    });
  }

  // ==================== ScreenshotOne API 截图（备选）====================

  async captureWithApi(url, scrollTo) {
    const s = this.plugin.settings;
    const params = new URLSearchParams({
      access_key: s.apiKey,
      url: url,
      viewport_width: String(s.viewportWidth),
      viewport_height: String(s.viewportHeight),
      format: s.format,
      response_type: "by_format",
      delay: String(s.delay),
    });
    if (s.fullPage) params.set("full_page", "true");
    if (s.blockAds) params.set("block_ads", "true");
    if (s.blockCookieBanners) params.set("block_cookie_banners", "true");
    if (s.blockChats) params.set("block_chats", "true");
    // API模式下用scripts参数实现滚动到指定位置
    if (scrollTo > 0) {
      params.set("scripts", `window.scrollTo(0,${scrollTo})`);
      params.set("scripts_wait_until", "networkidle");
    }

    const apiUrl = "https://api.screenshotone.com/take?" + params.toString();
    console.log("[Web Clipper] API Capturing:", url, scrollTo > 0 ? `(offset=${scrollTo})` : "");

    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      const errText = await resp.text();
      console.error("[Web Clipper] API error:", resp.status, errText.substring(0, 300));
      throw new Error("截图 API 错误 " + resp.status);
    }

    const buffer = await resp.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 100) throw new Error("截图数据为空");
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    return { base64, url };
  }

  async captureVideoWithApi(url, scenario) {
    const s = this.plugin.settings;
    const fmt = s.recordFormat || "mp4";
    const params = new URLSearchParams({
      access_key: s.apiKey,
      url: url,
      scenario: scenario || "scroll",
      format: fmt,
      duration: String(s.recordDuration || 15),
      viewport_width: String(s.viewportWidth),
      viewport_height: String(s.viewportHeight),
      delay: String(s.delay),
    });
    if (scenario === "scroll") {
      params.set("scroll_delay", String(s.scrollDelay || 500));
      params.set("scroll_duration", String(s.scrollDuration || 1500));
      params.set("scroll_by", String(s.scrollBy || 800));
    }
    if (s.blockAds) params.set("block_ads", "true");
    if (s.blockCookieBanners) params.set("block_cookie_banners", "true");
    if (s.blockChats) params.set("block_chats", "true");

    const apiUrl = "https://api.screenshotone.com/animate?" + params.toString();
    console.log("[Web Clipper] API Recording:", url);

    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error("录屏 API 错误 " + resp.status);
    }

    const buffer = await resp.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 500) throw new Error("录屏数据为空");
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    return { base64, url, isVideo: true };
  }

  // ==================== Step 4: Save & Replace ====================
  renderStep4_Done(body) {
    const s = body.createDiv("wc-step-content");
    s.createEl("h3", { text: "💾 Step 4: 保存并替换" });

    const folder = this.plugin.settings.imageFolder;
    const statusEl = s.createDiv("wc-save-status");
    statusEl.textContent = "正在保存...";
    const savedList = s.createDiv("wc-saved-list");

    this.saveAndReplace(folder, statusEl, savedList).then((count) => {
      const nav = s.createDiv("wc-nav-row");
      nav.createEl("button", { cls: "wc-secondary-btn", text: "📸 截新的" }).addEventListener("click", () => this.restart());

      if (this.selectedFile) {
        nav.createEl("button", { cls: "wc-primary-btn", text: "📄 打开文档查看" }).addEventListener("click", () => {
          this.app.workspace.openLinkText(this.selectedFile.path, "", false);
        });
      }
    });
  }

  async saveAndReplace(folder, statusEl, listEl) {
    const vault = this.app.vault;
    if (!vault.getAbstractFileByPath(folder)) await vault.createFolder(folder);

    const savedFiles = [];
    const ts = Date.now();

    // Save all screenshots and videos
    for (let i = 0; i < this.screenshots.length; i++) {
      const ss = this.screenshots[i];
      if (!ss || !ss.base64) continue;

      const marker = this.markers[i];
      const isVideo = marker && (marker.type === "scroll" || marker.type === "still");
      const ext = isVideo ? (this.plugin.settings.recordFormat || "mp4") : "png";
      const fn = folder + "/clip-" + ts + "-" + (i + 1) + "." + ext;
      try {
        await vault.createBinary(fn, Uint8Array.from(atob(ss.base64), c => c.charCodeAt(0)));
        savedFiles.push({ index: i, path: fn });
        listEl.createDiv({ cls: "wc-saved-item", text: "✅ " + fn });
      } catch (e) {
        listEl.createDiv({ cls: "wc-saved-item wc-saved-error", text: "❌ " + fn + " - " + e.message });
      }
    }

    // Replace markers in document
    if (this.selectedFile && savedFiles.length > 0) {
      try {
        let content = await this.app.vault.read(this.selectedFile);
        let replaceCount = 0;

        for (const sf of savedFiles) {
          const marker = this.markers[sf.index];
          if (marker && content.includes(marker.fullMatch)) {
            content = content.replace(marker.fullMatch, "![[" + sf.path + "]]");
            replaceCount++;
          }
        }

        if (replaceCount > 0) {
          await this.app.vault.modify(this.selectedFile, content);
          statusEl.textContent = `✅ 已保存 ${savedFiles.length} 张截图，替换了「${this.selectedFile.basename}」中 ${replaceCount} 个标记！`;
        } else {
          statusEl.textContent = "✅ 截图已保存，但未找到可替换的标记";
        }
      } catch (e) {
        statusEl.textContent = "✅ 截图已保存，替换失败: " + e.message;
      }
    } else {
      statusEl.textContent = `✅ 已保存 ${savedFiles.length} 张截图！`;
    }

    return savedFiles.length;
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
class WebClipperSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const el = this.containerEl; el.empty();
    el.createEl("h2", { text: "📸 Web Clipper 设置" });

    new obsidian.Setting(el).setName("截图引擎")
      .setDesc("Playwright（本地，支持翻译）或 ScreenshotOne API（云端）")
      .addDropdown(d => d.addOptions({ playwright: "🖥️ 本地 Playwright（推荐）", api: "☁️ ScreenshotOne API" })
        .setValue(this.plugin.settings.engine)
        .onChange(async v => { this.plugin.settings.engine = v; await this.plugin.saveSettings(); this.display(); }));

    if (this.plugin.settings.engine === "api") {
      new obsidian.Setting(el).setName("ScreenshotOne API Key")
        .setDesc("从 screenshotone.com 免费注册获取")
        .addText(t => t.setPlaceholder("API Key").setValue(this.plugin.settings.apiKey)
          .onChange(async v => { this.plugin.settings.apiKey = v.trim(); await this.plugin.saveSettings(); }));
    } else {
      new obsidian.Setting(el).setName("screenshot-server.js 路径")
        .setDesc("留空自动检测（默认在 05.插件/wechat-title-scraper/ 下）")
        .addText(t => t.setPlaceholder("自动检测").setValue(this.plugin.settings.screenshotServerPath)
          .onChange(async v => { this.plugin.settings.screenshotServerPath = v.trim(); await this.plugin.saveSettings(); }));
    }

    new obsidian.Setting(el).setName("截图保存文件夹")
      .addText(t => t.setPlaceholder("web-clipper-images").setValue(this.plugin.settings.imageFolder)
        .onChange(async v => { this.plugin.settings.imageFolder = v.trim() || "web-clipper-images"; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("视口宽度 (px)")
      .addText(t => t.setPlaceholder("1280").setValue(String(this.plugin.settings.viewportWidth))
        .onChange(async v => { this.plugin.settings.viewportWidth = parseInt(v) || 1280; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("视口高度 (px)")
      .addText(t => t.setPlaceholder("800").setValue(String(this.plugin.settings.viewportHeight))
        .onChange(async v => { this.plugin.settings.viewportHeight = parseInt(v) || 800; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("等待加载时间 (秒)")
      .setDesc("页面加载后等待几秒再截图，动态页面建议3-5秒")
      .addText(t => t.setPlaceholder("3").setValue(String(this.plugin.settings.delay))
        .onChange(async v => { this.plugin.settings.delay = parseInt(v) || 3; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("默认整页截图")
      .addToggle(t => t.setValue(this.plugin.settings.fullPage)
        .onChange(async v => { this.plugin.settings.fullPage = v; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("屏蔽广告")
      .addToggle(t => t.setValue(this.plugin.settings.blockAds)
        .onChange(async v => { this.plugin.settings.blockAds = v; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("屏蔽 Cookie 弹窗")
      .addToggle(t => t.setValue(this.plugin.settings.blockCookieBanners)
        .onChange(async v => { this.plugin.settings.blockCookieBanners = v; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("屏蔽聊天窗口")
      .addToggle(t => t.setValue(this.plugin.settings.blockChats)
        .onChange(async v => { this.plugin.settings.blockChats = v; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("英文页面自动翻译")
      .setDesc("截图前将英文页面内容翻译为中文（会增加几秒延迟）")
      .addToggle(t => t.setValue(this.plugin.settings.translateToZh)
        .onChange(async v => { this.plugin.settings.translateToZh = v; await this.plugin.saveSettings(); }));

    el.createEl("h3", { text: "🎬 录屏设置" });

    new obsidian.Setting(el).setName("录制时长 (秒)")
      .setDesc("滚动录屏的最大时长，1-30秒")
      .addText(t => t.setPlaceholder("15").setValue(String(this.plugin.settings.recordDuration))
        .onChange(async v => { this.plugin.settings.recordDuration = Math.min(30, Math.max(1, parseInt(v) || 15)); await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("视频格式")
      .addDropdown(d => d.addOptions({ mp4: "MP4", gif: "GIF", webm: "WebM" })
        .setValue(this.plugin.settings.recordFormat)
        .onChange(async v => { this.plugin.settings.recordFormat = v; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("滚动速度 (ms)")
      .setDesc("每次滚动动画的时长")
      .addText(t => t.setPlaceholder("1500").setValue(String(this.plugin.settings.scrollDuration))
        .onChange(async v => { this.plugin.settings.scrollDuration = parseInt(v) || 1500; await this.plugin.saveSettings(); }));

    new obsidian.Setting(el).setName("每次滚动像素")
      .addText(t => t.setPlaceholder("800").setValue(String(this.plugin.settings.scrollBy))
        .onChange(async v => { this.plugin.settings.scrollBy = parseInt(v) || 800; await this.plugin.saveSettings(); }));

    el.createEl("h3", { text: "📖 使用说明" });
    el.createDiv().innerHTML = `
      <p>1. 在文章中添加标记：</p>
      <p><b>📸 截图：</b><code>【截图①：URL ，描述】</code></p>
      <p><b>🎬 滚动录屏：</b><code>【录屏①：URL ，录制长页面滚动】</code></p>
      <p><b>⏺️ 动画录屏：</b><code>【动录①：URL ，录制页面自身动画/自动播放视频】</code></p>
      <p><b>📸 指定位置截图：</b><code>【截图①：URL#offset=800 ，描述】</code></p>
      <p>2. 点击左侧 📸 图标或命令面板搜索 'Web Clipper'</p>
      <p>3. 按步骤选择文档 → 确认 → 自动处理 → 保存替换</p>
      <p style="margin-top:8px;color:var(--text-faint)">
      📸 截图 → 保存为 PNG<br>
      📸 #offset=N → 先滚动到N像素位置再截图（同一URL截不同区域）<br>
      🎬 录屏 → 从上到下滚动页面，录制为 MP4/GIF<br>
      ⏺️ 动录 → 原地不动，录制页面自身的动画和自动播放内容</p>
    `;
  }
}

module.exports = WebClipperPlugin;
