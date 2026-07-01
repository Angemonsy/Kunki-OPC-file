/*
 * 🔬 口播分析师 · Obsidian 插件 v0.3
 * 林杰团队开发
 *
 * v0.3 新增:本地 ffmpeg 自动压缩,支持任意大小视频
 */

const { Notice, Plugin, PluginSettingTab, Setting, TFile, Modal, ItemView, WorkspaceLeaf, MarkdownRenderer, Component, requestUrl } = require("obsidian");

const VIEW_TYPE_CHECKER = "kobo-video-checker-view";
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

// ====== 设置默认值 ======
const DEFAULT_SETTINGS = {
	apiKey: "",
	baseUrl: "",
	model: "",                        // 学员自己按中转文档填(无默认,逼用户主动配置)
	reportFolder: "口播检测报告",
	smallVideoLimitMB: 18,            // 压缩目标上限
	ffmpegPath: "",                   // 留空 = 自动探测
	compressHeight: 720,
	compressCRF: 28,
};

// ffmpeg 自动探测的候选路径
const FFMPEG_CANDIDATES = [
	"/opt/homebrew/bin/ffmpeg",   // Mac Apple Silicon (brew)
	"/usr/local/bin/ffmpeg",       // Mac Intel (brew)
	"/usr/bin/ffmpeg",              // Linux
	"C:\\ffmpeg\\bin\\ffmpeg.exe",  // Win 常见安装位置
	"ffmpeg",                       // 兜底:走 PATH
];

// (移除 MODEL_PRESETS:不同中转模型 ID 差异太大,改为纯文本输入由学员填)

// ====== Prompt(跟网页版同源) ======
const CHECK_PROMPT = `你是「老板IP」专属短视频内容教练,服务对象是企业老板。
他们要的不是技术指导,而是「这条视频内容到底好不好,该怎么改」。

请仔细观看这段视频:
1. 完整听完音频,把口播原稿转录下来(逐字)
2. 看完整个画面,特别注意:
   - 画面下方/侧边的字幕(老板可能加了字幕,你不能说"没字幕")
   - 镜头切换 / 特效 / 文字遮罩 / 表情包
3. 感知节奏:开头 3 秒 / 中段 / 结尾,情绪曲线如何

然后按下面结构输出严格 Markdown 格式的报告。

# 报告结构

## 1. 整体评分
- 评分:X / 100 (内容占 60% 权重 + 表达占 25% + 技术占 15%)
- 评级:优秀(85+) / 良好(70-84) / 一般(55-69) / 较差(< 55)
- 一句话定调

## 2. 视频基础信息
- 时长:X 分 X 秒
- 内容类型:教知识 / 聊观点 / 讲故事 / 晒过程(四选一)
- 赛道判断:这条视频对的人群是?
- 完整口播稿(逐字转录,这一项必填):
> [把音频内容一字不差转录在这里,用引用块]

- 画面要素(场景/人物/镜头/特效/字幕一段写完):
  例:"场景为傍晚公园,人物为大头自拍,镜头手持晃动,叠加关键词字幕(如'定位''留存率'),字幕与口播一致 / 有偏差"

---

## 3. 内容层面深度分析

### 3.1 开篇 3 秒评估

- 开篇原文:"[原话]"
- 用了什么钩子:数据 / 反认知 / 痛点共鸣 / 故事悬念 / 直接结论 / 名人背书 / 无明显钩子
- 抓得住吗:🔴 抓不住 / 🟡 一般 / 🟢 强
- 评分:X / 10

### 3.2 13 大爆款元素命中分析

| # | 元素 | 是否命中 | 命中点 / 缺失原因 |
|---|---|---|---|
| 1 | 成本/金钱(便宜/赚钱/省时间) | ✅/❌ | ... |
| 2 | 最差元素(最坑/避雷/翻车) | ✅/❌ | ... |
| 3 | 荷尔蒙(颜值/魅力/两性) | ✅/❌ | ... |
| 4 | 人群元素(直接喊话目标人群) | ✅/❌ | ... |
| 5 | 场景元素(具体生活/工作场景) | ✅/❌ | ... |
| 6 | 数据元素(具体数字/百分比) | ✅/❌ | ... |
| 7 | 对比/对立(A vs B / 之前 vs 现在) | ✅/❌ | ... |
| 8 | 反向操作/反认知(打破常识) | ✅/❌ | ... |
| 9 | 怀旧元素(80后/90后/那些年) | ✅/❌ | ... |
| 10 | 奇葩/猎奇/揭秘(行业黑幕/没人说过) | ✅/❌ | ... |
| 11 | 头牌元素(头部/第一/排名) | ✅/❌ | ... |
| 12 | 高维认知(独到见解/思维降维) | ✅/❌ | ... |
| 13 | 钩子问题(疑问句开篇/制造好奇) | ✅/❌ | ... |

命中数:X / 13(爆款一般至少命中 3 个,7+ 是真爆款)

### 3.3 选题质量评估

- 目标人群:这条视频是讲给谁听的?能精准到职业/年龄/痛点吗?
- 痛点击中:打中了什么核心痛点?痛得够不够?
- 视角差异化:跟别人讲同一话题相比,有没有独特角度?
- 价值密度:看完老板能得到什么(认知/方法/情绪)
- 评分:X / 10

### 3.4 信息密度 & 节奏

- 干货占比:核心信息占多少比例(估算)
- 水话/废话:有哪些"网上都在说""大家可能不知道"这种铺垫废话?逐句指出
- 节奏感:有没有 3 秒钩子 → 铺垫 → 高潮 → 反转的设计?
- 情绪曲线:平淡 / 单一情绪 / 起伏 / 共鸣点在哪一秒
- 评分:X / 10

---

## 4. 表达层面

- 语速:快 / 慢 / 适中(具体每分钟多少字)
- 停顿:有没有逻辑停顿和强调停顿?
- 卡顿/口误:几处(列出时间点)
- 眼神:看镜头 / 看屏幕 / 飘忽
- 表情/感染力:有没有情绪起伏?是不是平白念稿?
- 底气/权威感:有没有"我是专业的"的气场?
- 评分:X / 10

---

## 5. 技术层面

简短列出:
- 画质:🟢 / 🟡 / 🔴
- 稳定:🟢 / 🟡 / 🔴
- 光线:🟢 / 🟡 / 🔴
- 声音:🟢 / 🟡 / 🔴
- 一句话总评

---

## 6. 优化建议

### 6.1 优化版口播稿

基于上面分析,重写一版口播稿(展示"如果是我会怎么改"):

> [完整重写版本,从开篇到结尾,要能让老板直接拿去重录]

- 重点改了哪几处:列 3-5 条

### 6.2 3 条核心改动(按影响力排序)

| 优先级 | 改动 | 为什么 | 怎么做 |
|---|---|---|---|
| 🔴 P0 | xxx | 影响完播率最大 | 具体动作 |
| 🟡 P1 | xxx | xxx | xxx |
| 🟢 P2 | xxx | xxx | xxx |

### 6.3 下一条视频方向建议

基于这条的延伸,推荐老板下一条该拍什么:
- 选题方向 1:xxx (理由:xxx)
- 选题方向 2:xxx
- 推荐用什么钩子:xxx
- 风格微调:xxx

---

## 7. 总结

- 当前分数:X / 100
- 改完预期:X / 100
- 老板这条对的方向(必须先肯定一下):xxx
- 最该改的一点(只说一点):xxx

---

# 风格要求(铁律)

- ❌ 不寒暄("非常感谢您的视频" "希望能帮到您"全删)
- ❌ 不说"建议提升整体质感"这种废话
- ❌ 不要 AI 腔("综上所述""值得注意的是"全删)
- ✅ 数字说话(几处 / 百分比 / 分数)
- ✅ 逐句举例(指出问题时,引用原话"……")
- ✅ 可执行(每条建议必须能马上行动)
- ✅ 直接犀利(老板们能接受真话)

现在开始分析。`;

// ====== 右侧栏视图(主使用界面) ======
class VideoCheckerView extends ItemView {
	constructor(leaf, plugin) {
		super(leaf);
		this.plugin = plugin;
		this.component = null;
	}

	getViewType() { return VIEW_TYPE_CHECKER; }
	getDisplayText() { return "🔬 口播分析师"; }
	getIcon() { return "microscope"; }

	async onOpen() {
		this.refresh();
	}

	async onClose() {
		if (this.component) {
			this.component.unload();
			this.component = null;
		}
	}

	// 刷新面板内容
	refresh() {
		const c = this.contentEl;
		c.empty();
		if (this.component) { this.component.unload(); this.component = null; }
		c.style.padding = "16px";
		this.renderHomeView(c);
	}

	renderHomeView(c) {
		// 标题
		c.createEl("h3", { text: "🔬 口播分析师" });
		const subtitle = c.createEl("p", {
			cls: "setting-item-description",
			text: "林杰团队开发 · 内部工具,请勿外传",
		});
		subtitle.style.marginTop = "-8px";

		// 设置完整性检查
		const s = this.plugin.settings;
		const model = this.plugin.getEffectiveModel();
		const ready = !!(s.apiKey && s.baseUrl && model);
		if (!ready) {
			const warn = c.createDiv();
			warn.style.padding = "12px";
			warn.style.background = "var(--background-modifier-error)";
			warn.style.borderRadius = "8px";
			warn.style.marginBottom = "12px";
			warn.createEl("div", { text: "⚠️ 还没配置完", cls: "setting-item-name" });
			const tips = warn.createEl("ul");
			if (!s.apiKey) tips.createEl("li", { text: "缺 API Key" });
			if (!s.baseUrl) tips.createEl("li", { text: "缺 API Base URL" });
			if (!model) tips.createEl("li", { text: "缺模型" });
			const open = warn.createEl("button", { text: "打开设置" });
			open.onclick = () => {
				this.app.setting.open();
				this.app.setting.openTabById(this.plugin.manifest.id);
			};
		} else {
			const info = c.createDiv();
			info.style.padding = "10px 12px";
			info.style.background = "var(--background-secondary)";
			info.style.borderRadius = "8px";
			info.style.marginBottom = "12px";
			info.style.fontSize = "0.85em";
			info.createDiv({ text: `当前模型:${model}` });
			info.createDiv({ text: `中转地址:${s.baseUrl}` });
		}

		const actions = c.createDiv();
		actions.style.display = "flex";
		actions.style.flexDirection = "column";
		actions.style.gap = "8px";
		actions.style.marginBottom = "16px";

		const pickLocalBtn = actions.createEl("button", { text: "📂 选择视频检测" });
		pickLocalBtn.style.padding = "14px";
		pickLocalBtn.style.fontSize = "1em";
		pickLocalBtn.style.fontWeight = "600";
		pickLocalBtn.style.cursor = "pointer";
		pickLocalBtn.onclick = () => this.plugin.pickLocalAndCheck();

		const settingBtn = actions.createEl("button", { text: "⚙️ 打开设置" });
		settingBtn.style.padding = "8px";
		settingBtn.onclick = () => {
			this.app.setting.open();
			this.app.setting.openTabById(this.plugin.manifest.id);
		};

		const hr = c.createEl("hr");
		hr.style.margin = "16px 0";
		c.createEl("h4", { text: "📋 最近报告" });
		this.renderRecentReports(c);
	}

	async renderRecentReports(container) {
		const folder = this.plugin.settings.reportFolder;
		const adapter = this.app.vault.adapter;
		const list = container.createDiv();
		list.style.display = "flex";
		list.style.flexDirection = "column";
		list.style.gap = "6px";

		const exists = await adapter.exists(folder);
		if (!exists) {
			const empty = list.createDiv({ text: "(还没有报告。检测一个视频试试 ↑)" });
			empty.style.color = "var(--text-muted)";
			empty.style.fontSize = "0.9em";
			return;
		}

		const files = this.app.vault.getMarkdownFiles()
			.filter(f => f.path.startsWith(folder + "/"))
			.sort((a, b) => b.stat.mtime - a.stat.mtime)
			.slice(0, 15);

		if (files.length === 0) {
			const empty = list.createDiv({ text: "(还没有报告)" });
			empty.style.color = "var(--text-muted)";
			empty.style.fontSize = "0.9em";
			return;
		}

		for (const f of files) {
			const item = list.createDiv();
			item.style.padding = "8px 10px";
			item.style.border = "1px solid var(--background-modifier-border)";
			item.style.borderRadius = "6px";
			item.style.cursor = "pointer";
			item.style.fontSize = "0.9em";

			item.createDiv({ text: "📄 " + f.basename });
			const meta = item.createDiv({
				text: new Date(f.stat.mtime).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" }),
			});
			meta.style.color = "var(--text-muted)";
			meta.style.fontSize = "0.85em";
			meta.style.marginTop = "2px";

			item.onmouseover = () => { item.style.background = "var(--background-modifier-hover)"; };
			item.onmouseleave = () => { item.style.background = ""; };
			item.onclick = async () => {
				await this.app.workspace.getLeaf(true).openFile(f);
			};
		}
	}
}

// ====== 视频文件选择 Modal ======
class VideoPickerModal extends Modal {
	constructor(app, files, onChoose) {
		super(app);
		this.files = files;
		this.onChoose = onChoose;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h2", { text: "选择要检测的视频" });

		const sorted = [...this.files].sort((a, b) => b.stat.mtime - a.stat.mtime);

		const listEl = contentEl.createDiv({ cls: "kobo-video-list" });
		listEl.style.maxHeight = "400px";
		listEl.style.overflowY = "auto";

		for (const file of sorted) {
			const sizeMB = (file.stat.size / 1024 / 1024).toFixed(1);
			const item = listEl.createDiv({ cls: "kobo-video-item" });
			item.style.padding = "10px 14px";
			item.style.border = "1px solid var(--background-modifier-border)";
			item.style.borderRadius = "8px";
			item.style.marginBottom = "6px";
			item.style.cursor = "pointer";

			item.createDiv({ text: `🎬 ${file.basename}.${file.extension}` });
			const meta = item.createDiv({
				text: `${sizeMB} MB · ${file.parent ? file.parent.path : "/"}`,
			});
			meta.style.fontSize = "0.85em";
			meta.style.color = "var(--text-muted)";
			meta.style.marginTop = "4px";

			item.onmouseover = () => {
				item.style.background = "var(--background-modifier-hover)";
			};
			item.onmouseleave = () => {
				item.style.background = "";
			};
			item.onclick = () => {
				this.close();
				this.onChoose(file);
			};
		}
	}

	onClose() {
		this.contentEl.empty();
	}
}

// ====== 设置页 ======
class VideoCheckerSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "🔬 口播分析师" });
		containerEl.createEl("p", {
			text: "上传你拍的口播视频,AI 自动分析「内容 / 表达 / 技术」三个层面,并给出优化建议。",
			cls: "setting-item-description",
		});

		new Setting(containerEl)
			.setName("API Key")
			.setDesc("你的 API 中转站 Key")
			.addText((text) =>
				text
					.setPlaceholder("sk-xxxxxxxx")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (v) => {
						this.plugin.settings.apiKey = v.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("API Base URL")
			.setDesc("中转站地址(必填)")
			.addText((text) =>
				text
					.setPlaceholder("如:https://yunwu.ai")
					.setValue(this.plugin.settings.baseUrl)
					.onChange(async (v) => {
						this.plugin.settings.baseUrl = v.trim();
						await this.plugin.saveSettings();
					})
			);

		// 模型:纯文本输入(不同中转模型 ID 差异太大,不用下拉)
		const modelDesc = createFragment((frag) => {
			frag.appendText("按你的中转站文档填具体模型名(必须支持视频输入)。常见参考:");
			frag.createEl("br");
			frag.createEl("code", { text: "gemini-3.1-pro-preview-search" });
			frag.appendText("(灵芽)、");
			frag.createEl("code", { text: "gemini-2.5-pro" });
			frag.appendText("(云雾)、");
			frag.createEl("code", { text: "gemini-3.1-flash-lite" });
			frag.appendText("(便宜)、");
			frag.createEl("code", { text: "gpt-5.5" });
			frag.appendText(" 等");
		});

		new Setting(containerEl)
			.setName("模型")
			.setDesc(modelDesc)
			.addText((text) =>
				text
					.setPlaceholder("如:gemini-3.1-pro-preview-search")
					.setValue(this.plugin.settings.model)
					.onChange(async (v) => {
						this.plugin.settings.model = v.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("报告存档目录")
			.setDesc("生成的报告会存到这个目录")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.reportFolder)
					.onChange(async (v) => {
						this.plugin.settings.reportFolder = v.trim() || "口播检测报告";
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h3", { text: "怎么用?" });
		const ul = containerEl.createEl("ul");
		ul.createEl("li", {
			text: "方式 1:把视频拖进 vault 任意位置 → 右键 → 「检测口播视频质量」",
		});
		ul.createEl("li", {
			text: "方式 2:命令面板(Cmd/Ctrl+P)→ 「检测当前视频文件」",
		});
		ul.createEl("li", {
			text: "方式 3:点左侧栏的视频图标 🎬",
		});
		ul.createEl("li", {
			text: "处理时间约 1-3 分钟,完成后报告会自动打开",
		});

		// ffmpeg 配置(高级)
		containerEl.createEl("h3", { text: "高级:视频压缩(ffmpeg)" });
		const ffmpegDesc = containerEl.createEl("p", {
			cls: "setting-item-description",
		});
		ffmpegDesc.innerHTML = `
		大视频会自动用本地 ffmpeg 压到 720p 以下后再上传(因为 API 限制 ≤18MB)。<br>
		<b>Mac</b>:终端跑 <code>brew install ffmpeg</code> 即可<br>
		<b>Windows</b>:从 <a href="https://ffmpeg.org/download.html">ffmpeg.org</a> 下载后,把路径填到下面
		`;

		new Setting(containerEl)
			.setName("ffmpeg 路径(可选)")
			.setDesc("留空 = 自动探测(brew/PATH)。手动填完整路径,例如 C:\\ffmpeg\\bin\\ffmpeg.exe")
			.addText((text) =>
				text
					.setPlaceholder("留空自动探测")
					.setValue(this.plugin.settings.ffmpegPath)
					.onChange(async (v) => {
						this.plugin.settings.ffmpegPath = v.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("测试 ffmpeg")
			.setDesc("检查 ffmpeg 是否可用")
			.addButton((btn) =>
				btn.setButtonText("测试").onClick(async () => {
					btn.setButtonText("检测中…").setDisabled(true);
					const found = await this.plugin.detectFfmpeg();
					btn.setButtonText("测试").setDisabled(false);
					if (found) {
						new Notice(`✅ ffmpeg 可用:${found}`, 6000);
					} else {
						new Notice(
							`❌ 找不到 ffmpeg。可以点下面「一键下载 ffmpeg」自动装。`,
							10000
						);
					}
				})
			);

		new Setting(containerEl)
			.setName("一键下载 ffmpeg")
			.setDesc("从国内镜像下载预编译二进制(约 30MB)到 ~/.kobo-checker/bin/,自动写入路径")
			.addButton((btn) =>
				btn.setButtonText("下载").onClick(async () => {
					btn.setButtonText("下载中…").setDisabled(true);
					try {
						const target = await this.plugin.downloadFfmpeg((pct) => {
							btn.setButtonText(`下载中 ${pct}%`);
						});
						this.plugin.settings.ffmpegPath = target;
						await this.plugin.saveSettings();
						new Notice(`✅ 已装好:${target}`, 8000);
						this.display();
					} catch (e) {
						console.error(e);
						new Notice(`❌ 下载失败:${e.message || e}`, 12000);
					} finally {
						btn.setButtonText("下载").setDisabled(false);
					}
				})
			);

		new Setting(containerEl)
			.setName("压缩目标分辨率")
			.setDesc("默认 720(高度,宽度自适应)。值越小文件越小但越糊")
			.addText((text) =>
				text
					.setValue(String(this.plugin.settings.compressHeight))
					.onChange(async (v) => {
						const n = parseInt(v, 10);
						if (!isNaN(n) && n >= 240 && n <= 1080) {
							this.plugin.settings.compressHeight = n;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("压缩质量 CRF")
			.setDesc("18-32,越小越清晰但文件越大,默认 28(平衡)")
			.addText((text) =>
				text
					.setValue(String(this.plugin.settings.compressCRF))
					.onChange(async (v) => {
						const n = parseInt(v, 10);
						if (!isNaN(n) && n >= 18 && n <= 35) {
							this.plugin.settings.compressCRF = n;
							await this.plugin.saveSettings();
						}
					})
			);

		containerEl.createEl("h3", { text: "关于" });
		containerEl.createEl("p", {
			text: "v0.3 · 林杰团队开发 · 请勿外传",
			cls: "setting-item-description",
		});
	}
}

// ====== 主插件类 ======
class VideoCheckerPlugin extends Plugin {
	async onload() {
		await this.loadSettings();

		// 注册右侧栏 View
		this.registerView(VIEW_TYPE_CHECKER, (leaf) => new VideoCheckerView(leaf, this));

		// 命令:打开右侧面板
		this.addCommand({
			id: "open-checker-panel",
			name: "打开检测面板",
			callback: () => this.activateView(),
		});

		// 命令:直接选视频检测
		this.addCommand({
			id: "check-video",
			name: "选视频检测",
			callback: () => this.pickAndCheck(),
		});

		// 右键菜单(视频文件)
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (this.isVideoFile(file)) {
					menu.addItem((item) => {
						item.setTitle("🔬 用口播分析师检测")
							.setIcon("microscope")
							.onClick(() => this.checkVideo(file));
					});
				}
			})
		);

		// 左侧栏图标:点击 → 打开右侧栏面板
		this.addRibbonIcon("microscope", "🔬 口播分析师", () => {
			this.activateView();
		});

		// 设置页
		this.addSettingTab(new VideoCheckerSettingTab(this.app, this));

		console.log("[口播视频检测] 插件已加载 v0.3");
	}

	onunload() {
		console.log("[口播视频检测] 插件已卸载");
	}

	// 激活右侧栏面板(已开则聚焦,未开则新建)
	async activateView() {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(VIEW_TYPE_CHECKER)[0];
		if (!leaf) {
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_CHECKER, active: true });
		}
		workspace.revealLeaf(leaf);
	}

	// 刷新面板
	refreshView() {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CHECKER);
		for (const leaf of leaves) {
			const view = leaf.view;
			if (view instanceof VideoCheckerView) view.refresh();
		}
	}

async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		// 兼容老版本:从 modelPreset/customModel 迁移到 model
		if (!this.settings.model && (this.settings.modelPreset || this.settings.customModel)) {
			if (this.settings.modelPreset === "custom") {
				this.settings.model = (this.settings.customModel || "").trim();
			} else if (this.settings.modelPreset) {
				this.settings.model = this.settings.modelPreset;
			}
			delete this.settings.modelPreset;
			delete this.settings.customModel;
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	isVideoFile(file) {
		if (!file) return false;
		const ext = (file.extension || "").toLowerCase();
		return ["mp4", "mov", "m4v", "webm", "mkv"].includes(ext);
	}

	pickAndCheck() {
		const videos = this.app.vault
			.getFiles()
			.filter((f) => this.isVideoFile(f));

		if (videos.length === 0) {
			new Notice(
				"⚠️ 你的知识库里还没有视频文件。请用「从电脑选择视频」直接传本地视频。"
			);
			return;
		}

		new VideoPickerModal(this.app, videos, (file) => {
			this.checkVideo(file);
		}).open();
	}

	// 从本地电脑选视频
	async pickLocalAndCheck() {
		// 优先用 Electron dialog(最稳)
		try {
			const electron = require("electron");
			const remote = electron.remote || require("@electron/remote");
			if (remote && remote.dialog) {
				const win = remote.getCurrentWindow ? remote.getCurrentWindow() : null;
				const result = await remote.dialog.showOpenDialog(win, {
					title: "选择口播视频",
					properties: ["openFile"],
					filters: [
						{ name: "视频文件", extensions: ["mp4", "mov", "m4v", "webm", "mkv"] },
					],
				});
				if (!result.canceled && result.filePaths && result.filePaths[0]) {
					const p = result.filePaths[0];
					const stat = fs.statSync(p);
					this.checkLocalVideo(p, path.basename(p), stat.size);
				}
				return;
			}
		} catch (e) {
			console.warn("[口播] electron dialog 不可用,降级 input file picker:", e);
		}

		// 降级:用 HTML input + webUtils 取路径
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "video/mp4,video/quicktime,video/x-m4v,video/webm,video/x-matroska,.mp4,.mov,.m4v,.webm,.mkv";
		input.style.display = "none";
		document.body.appendChild(input);
		input.onchange = () => {
			const f = input.files && input.files[0];
			document.body.removeChild(input);
			if (!f) return;
			let fullPath = f.path;  // 老 Electron 路径
			if (!fullPath) {
				// 新 Electron(28+):用 webUtils.getPathForFile
				try {
					const electron = require("electron");
					if (electron.webUtils && electron.webUtils.getPathForFile) {
						fullPath = electron.webUtils.getPathForFile(f);
					}
				} catch (e) { /* ignore */ }
			}
			if (!fullPath) {
				new Notice(
					"❌ 拿不到文件完整路径。请把视频拖进 vault,然后右键 → 检测口播视频质量。",
					12000
				);
				return;
			}
			this.checkLocalVideo(fullPath, f.name, f.size);
		};
		input.click();
	}

	// 实际生效的模型名
	getEffectiveModel() {
		return (this.settings.model || "").trim();
	}

	// 检测本地电脑上的视频文件(不进 vault)
	async checkLocalVideo(absPath, displayName, sizeBytes) {
		// 把"本地路径"包装成跟 vault TFile 类似的接口给 checkVideo 用
		const fakeFile = {
			__local: true,
			__absPath: absPath,
			path: absPath,
			name: displayName,
			basename: path.basename(displayName, path.extname(displayName)),
			extension: path.extname(displayName).replace(/^\./, "").toLowerCase(),
			stat: { size: sizeBytes, mtime: Date.now(), ctime: Date.now() },
		};
		return this.checkVideo(fakeFile);
	}

	async checkVideo(file) {
		const s = this.settings;
		const model = this.getEffectiveModel();

		// 1. 前置校验
		if (!s.apiKey) {
			new Notice("❌ 请先在设置里填 API Key", 6000);
			return;
		}
		if (!s.baseUrl) {
			new Notice("❌ 请先在设置里填 API Base URL(如 https://yunwu.ai)", 6000);
			return;
		}
		if (!model) {
			new Notice("❌ 请先在设置里选模型(或填自定义模型名)", 6000);
			return;
		}

		const fileSizeMB = file.stat.size / 1024 / 1024;
		const needCompress = fileSizeMB > s.smallVideoLimitMB;

		// 进度提示(常驻)
		const notice = new Notice("🎬 准备中…", 0);
		const progressSteps = [
			"🎬 正在分析视频画面…",
			"📝 正在解析脚本结构…",
			"🔥 正在评估爆款元素…",
			"📄 正在输出完整报告…",
		];
		let stepIdx = -1;
		let timer = null;
		const startAnalysisTicker = () => {
			stepIdx = 0;
			notice.setMessage(progressSteps[0]);
			timer = window.setInterval(() => {
				if (stepIdx < progressSteps.length - 1) {
					stepIdx++;
					notice.setMessage(progressSteps[stepIdx]);
				}
			}, 30000);
		};

		// 临时文件清理列表
		const tempFiles = [];

		try {
			let videoBuf;
			const mime = this.mimeFromExt(file.extension);

			if (needCompress) {
				notice.setMessage(`📦 视频 ${fileSizeMB.toFixed(1)}MB,正在压缩…`);
				let inputPath;
				if (file.__local) {
					// 本地视频:直接用绝对路径,不需要拷贝
					inputPath = file.__absPath;
				} else {
					// vault 内视频:先写临时文件供 ffmpeg 读
					inputPath = path.join(
						os.tmpdir(),
						`kobo-in-${Date.now()}${path.extname(file.name) || ".mp4"}`
					);
					const rawBuf = await this.app.vault.readBinary(file);
					fs.writeFileSync(inputPath, Buffer.from(rawBuf));
					tempFiles.push(inputPath);
				}

				const outputTmp = path.join(os.tmpdir(), `kobo-out-${Date.now()}.mp4`);
				tempFiles.push(outputTmp);
				await this.compressVideo(inputPath, outputTmp, notice);

				const outStat = fs.statSync(outputTmp);
				const compressedMB = (outStat.size / 1024 / 1024).toFixed(1);
				notice.setMessage(`✅ 已压缩到 ${compressedMB}MB,准备上传…`);
				const arr = fs.readFileSync(outputTmp);
				videoBuf = arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
			} else {
				if (file.__local) {
					const arr = fs.readFileSync(file.__absPath);
					videoBuf = arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
				} else {
					videoBuf = await this.app.vault.readBinary(file);
				}
			}

			// 4) 调模型(全部走 inline_data,因为云雾不支持 File API)
			startAnalysisTicker();
			const base64 = this.arrayBufferToBase64(videoBuf);
			const reportMd = await this.callModelWithInlineData(base64, mime, model);

			// 5) 直接存档 + 打开
			const reportPath = await this.saveReport(file.basename, reportMd, model);

			if (timer) window.clearInterval(timer);
			notice.hide();
			new Notice(`✅ 报告已生成:${reportPath}`, 5000);

			const reportFile = this.app.vault.getAbstractFileByPath(reportPath);
			if (reportFile instanceof TFile) {
				await this.app.workspace.getLeaf(true).openFile(reportFile);
			}
			this.refreshView();
		} catch (e) {
			if (timer) window.clearInterval(timer);
			notice.hide();
			console.error("[口播视频检测] 失败:", e);
			new Notice(`❌ 检测失败:${e.message || e}`, 12000);
		} finally {
			// 清理临时文件
			for (const t of tempFiles) {
				try { fs.unlinkSync(t); } catch (_) {}
			}
		}
	}

	// ========== ffmpeg ==========

	// 探测 ffmpeg 路径(尝试候选路径,返回第一个能跑通的)
	async detectFfmpeg() {
		const userPath = (this.settings.ffmpegPath || "").trim();
		const candidates = userPath ? [userPath, ...FFMPEG_CANDIDATES] : FFMPEG_CANDIDATES;
		for (const p of candidates) {
			try {
				await new Promise((resolve, reject) => {
					const proc = spawn(p, ["-version"]);
					let done = false;
					proc.on("error", () => { if (!done) { done = true; reject(); } });
					proc.on("close", (code) => { if (!done) { done = true; code === 0 ? resolve() : reject(); } });
				});
				return p;
			} catch (_) { /* 继续试下一个 */ }
		}
		return null;
	}

	// 一键下载 ffmpeg 到 ~/.kobo-checker/bin/
	async downloadFfmpeg(onProgress) {
		const https = require("https");
		const platform = process.platform; // "darwin" | "win32" | "linux"
		const arch = process.arch;          // "arm64" | "x64"

		let assetName, outName;
		if (platform === "darwin") {
			assetName = arch === "arm64" ? "ffmpeg-darwin-arm64" : "ffmpeg-darwin-x64";
			outName = "ffmpeg";
		} else if (platform === "win32") {
			assetName = "ffmpeg-win32-x64.exe";
			outName = "ffmpeg.exe";
		} else if (platform === "linux") {
			assetName = "ffmpeg-linux-x64";
			outName = "ffmpeg";
		} else {
			throw new Error(`未支持的平台 ${platform}`);
		}

		const binDir = path.join(os.homedir(), ".kobo-checker", "bin");
		fs.mkdirSync(binDir, { recursive: true });
		const targetPath = path.join(binDir, outName);

		// 多源:国内镜像优先,GitHub 兜底
		const sources = [
			`https://mirror.ghproxy.com/https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/${assetName}`,
			`https://gh-proxy.com/https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/${assetName}`,
			`https://ghfast.top/https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/${assetName}`,
			`https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/${assetName}`,
		];

		let lastErr = null;
		for (const url of sources) {
			try {
				await this._downloadToFile(url, targetPath, onProgress);
				// 验证大小(<10MB 一定是失败响应)
				const sz = fs.statSync(targetPath).size;
				if (sz < 10 * 1024 * 1024) {
					fs.unlinkSync(targetPath);
					throw new Error(`下载文件过小 (${sz} bytes),可能是 404/HTML`);
				}
				if (platform !== "win32") {
					fs.chmodSync(targetPath, 0o755);
				}
				return targetPath;
			} catch (e) {
				console.warn(`[ffmpeg dl] ${url} 失败:`, e.message);
				lastErr = e;
				try { fs.unlinkSync(targetPath); } catch (_) {}
			}
		}
		throw new Error(`所有镜像都失败。最后错误:${lastErr ? lastErr.message : "unknown"}`);
	}

	_downloadToFile(url, targetPath, onProgress, maxRedirects = 5) {
		const https = require("https");
		const http = require("http");
		return new Promise((resolve, reject) => {
			const get = (u, redirectsLeft) => {
				const lib = u.startsWith("https") ? https : http;
				const req = lib.get(u, { headers: { "User-Agent": "kobo-video-checker" } }, (res) => {
					if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
						if (redirectsLeft <= 0) { reject(new Error("redirect 过多")); return; }
						const loc = res.headers.location;
						if (!loc) { reject(new Error("redirect 缺 location")); return; }
						res.resume();
						get(loc.startsWith("http") ? loc : new URL(loc, u).href, redirectsLeft - 1);
						return;
					}
					if (res.statusCode !== 200) {
						reject(new Error(`HTTP ${res.statusCode}`));
						res.resume();
						return;
					}
					const total = parseInt(res.headers["content-length"] || "0", 10);
					let received = 0;
					let lastPct = 0;
					const file = fs.createWriteStream(targetPath);
					res.on("data", (chunk) => {
						received += chunk.length;
						if (total && onProgress) {
							const pct = Math.min(99, Math.round((received / total) * 100));
							if (pct - lastPct >= 2) { lastPct = pct; onProgress(pct); }
						}
					});
					res.pipe(file);
					file.on("finish", () => { file.close(() => resolve()); });
					file.on("error", reject);
				});
				req.setTimeout(60000, () => { req.destroy(new Error("连接超时")); });
				req.on("error", reject);
			};
			get(url, maxRedirects);
		});
	}

	async compressVideo(inputPath, outputPath, notice) {
		const ffmpegBin = await this.detectFfmpeg();
		if (!ffmpegBin) {
			throw new Error(
				"找不到 ffmpeg。Mac 终端跑 `brew install ffmpeg`,Win 下载 ffmpeg.exe 后在设置里填路径。"
			);
		}
		const args = [
			"-i", inputPath,
			"-vf", `scale=-2:${this.settings.compressHeight}`,
			"-c:v", "libx264",
			"-crf", String(this.settings.compressCRF),
			"-preset", "fast",
			"-c:a", "aac",
			"-b:a", "96k",
			"-movflags", "+faststart",
			"-y",
			outputPath,
		];

		return new Promise((resolve, reject) => {
			const proc = spawn(ffmpegBin, args);
			let stderr = "";
			let duration = 0;
			let lastShownPct = 0;

			proc.stderr.on("data", (d) => {
				const s = d.toString();
				stderr += s;
				// 解析 ffmpeg 进度("Duration: 00:01:23" 和 "time=00:00:45")
				if (!duration) {
					const m = s.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
					if (m) duration = +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]);
				}
				const t = s.match(/time=\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
				if (t && duration && notice) {
					const cur = +t[1] * 3600 + +t[2] * 60 + parseFloat(t[3]);
					const pct = Math.min(99, Math.round((cur / duration) * 100));
					if (pct - lastShownPct >= 5) {
						lastShownPct = pct;
						notice.setMessage(`📦 正在压缩视频… ${pct}%`);
					}
				}
			});
			proc.on("error", (err) => {
				if (err.code === "ENOENT") {
					reject(new Error("ffmpeg 未找到,请检查安装"));
				} else {
					reject(err);
				}
			});
			proc.on("close", (code) => {
				if (code === 0) resolve();
				else reject(new Error(`ffmpeg 压缩失败 (exit ${code}): ${stderr.slice(-300)}`));
			});
		});
	}

	mimeFromExt(ext) {
		const map = { mp4: "video/mp4", mov: "video/quicktime", m4v: "video/x-m4v", webm: "video/webm", mkv: "video/x-matroska" };
		return map[(ext || "").toLowerCase()] || "video/mp4";
	}

	// ========== Gemini File API(预留,云雾当前不支持) ==========
	// eslint-disable-next-line
	async uploadFileToGemini(buf, mimeType, displayName) {
		const base = this.settings.baseUrl.replace(/\/$/, "");
		const numBytes = buf.byteLength;

		// Step 1: start resumable upload
		const startRes = await requestUrl({
			url: `${base}/upload/v1beta/files`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.settings.apiKey}`,
				"X-Goog-Upload-Protocol": "resumable",
				"X-Goog-Upload-Command": "start",
				"X-Goog-Upload-Header-Content-Length": String(numBytes),
				"X-Goog-Upload-Header-Content-Type": mimeType,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ file: { display_name: displayName } }),
			throw: false,
		});
		if (startRes.status !== 200) {
			throw new Error(
				`File API 启动失败 (${startRes.status}): ${(startRes.text || "").slice(0, 300)}`
			);
		}
		// 从 headers 拿 upload url(可能 X-Goog-Upload-URL 或 location)
		const uploadUrl =
			startRes.headers["x-goog-upload-url"] ||
			startRes.headers["X-Goog-Upload-URL"] ||
			startRes.headers["location"];
		if (!uploadUrl) {
			throw new Error(
				"File API 没返回上传地址(中转站可能不支持 File API,请换 Gemini 模型或换中转站)"
			);
		}

		// Step 2: 实际上传二进制
		const upRes = await requestUrl({
			url: uploadUrl,
			method: "POST",
			headers: {
				"Content-Length": String(numBytes),
				"X-Goog-Upload-Offset": "0",
				"X-Goog-Upload-Command": "upload, finalize",
			},
			body: buf,
			throw: false,
		});
		if (upRes.status !== 200) {
			throw new Error(
				`视频上传失败 (${upRes.status}): ${(upRes.text || "").slice(0, 300)}`
			);
		}
		const fileObj = upRes.json && upRes.json.file;
		if (!fileObj || !fileObj.uri) {
			throw new Error(`视频上传响应异常: ${JSON.stringify(upRes.json).slice(0, 300)}`);
		}

		// Step 3: 轮询直到 ACTIVE(视频需要后端处理)
		let state = fileObj.state || "PROCESSING";
		const fileName = fileObj.name; // e.g. "files/abc123"
		const pollUrl = `${base}/v1beta/${fileName}`;
		const start = Date.now();
		while (state === "PROCESSING") {
			if (Date.now() - start > 180_000) {
				throw new Error("视频处理超时(>3 分钟),请稍后重试");
			}
			await new Promise((r) => setTimeout(r, 3000));
			const pollRes = await requestUrl({
				url: pollUrl,
				method: "GET",
				headers: { Authorization: `Bearer ${this.settings.apiKey}` },
				throw: false,
			});
			if (pollRes.status !== 200) {
				throw new Error(`轮询视频状态失败 (${pollRes.status})`);
			}
			state = pollRes.json.state;
		}
		if (state !== "ACTIVE") {
			throw new Error(`视频状态异常: ${state}`);
		}
		return fileObj.uri;
	}

	async callGeminiWithFileUri(fileUri, mimeType, model) {
		const url = `${this.settings.baseUrl.replace(/\/$/, "")}/v1beta/models/${model}:generateContent`;
		const payload = {
			contents: [
				{
					parts: [
						{ file_data: { mime_type: mimeType, file_uri: fileUri } },
						{ text: CHECK_PROMPT },
					],
				},
			],
			generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
		};

		const res = await requestUrl({
			url,
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.settings.apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
			throw: false,
		});
		if (res.status !== 200) {
			throw new Error(`API 返回 ${res.status}: ${(res.text || "").slice(0, 300)}`);
		}
		try {
			return res.json.candidates[0].content.parts[0].text;
		} catch (e) {
			throw new Error(`模型返回格式异常: ${JSON.stringify(res.json).slice(0, 300)}`);
		}
	}

	// ========== inline_data(其他模型) ==========
	async callModelWithInlineData(videoBase64, mimeType, model) {
		// Gemini 协议(/v1beta/models/.../generateContent) — 多数中转站此路径也兼容 GPT
		const url = `${this.settings.baseUrl.replace(/\/$/, "")}/v1beta/models/${model}:generateContent`;
		const payload = {
			contents: [
				{
					parts: [
						{ inline_data: { mime_type: mimeType, data: videoBase64 } },
						{ text: CHECK_PROMPT },
					],
				},
			],
			generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
		};

		const res = await requestUrl({
			url,
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.settings.apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
			throw: false,
		});
		if (res.status !== 200) {
			throw new Error(`API 返回 ${res.status}: ${(res.text || "").slice(0, 300)}`);
		}
		try {
			return res.json.candidates[0].content.parts[0].text;
		} catch (e) {
			throw new Error(`模型返回格式异常: ${JSON.stringify(res.json).slice(0, 300)}`);
		}
	}

	async saveReport(videoName, content, model) {
		const folder = this.settings.reportFolder;
		if (!(await this.app.vault.adapter.exists(folder))) {
			await this.app.vault.createFolder(folder);
		}

		const date = new Date();
		const ts = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		const time = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;

		const safeName = videoName.replace(/[\\/:*?"<>|]/g, "_");
		const fname = `${folder}/${ts}-${time}-${safeName}-质检报告.md`;

		const meta = `---
type: 口播视频质检报告
原视频: ${videoName}
模型: ${model || ""}
生成时间: ${ts} ${date.toTimeString().slice(0, 8)}
---

# 口播视频质检报告

> 原视频:${videoName}
> 模型:${model || ""}
> 生成:${ts} ${date.toTimeString().slice(0, 8)}

---

`;

		await this.app.vault.create(fname, meta + content);
		return fname;
	}

	arrayBufferToBase64(buf) {
		const bytes = new Uint8Array(buf);
		const CHUNK = 0x8000;
		const parts = [];
		for (let i = 0; i < bytes.length; i += CHUNK) {
			parts.push(String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK)));
		}
		return btoa(parts.join(""));
	}
}

module.exports = VideoCheckerPlugin;
