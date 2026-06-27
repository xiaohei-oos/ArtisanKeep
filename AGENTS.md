# AGENTS.md

## 项目概览
- **名称**：Texas Cottage Food Label Generator
- **类型**：纯前端单页应用（SPA）
- **技术栈**：HTML5 + CSS3 + Vanilla JavaScript（原生极简模式）
- **入口文件**：`index.html`
- **样式文件**：`styles/main.css`
- **逻辑文件**：`app.js`
- **外部依赖**：html2canvas（CDN，用于 PNG 导出）、Google Fonts（Playfair Display + Inter）

## 构建与运行
- **开发环境**：`python -m http.server ${DEPLOY_RUN_PORT} --bind 0.0.0.0`
- **无需构建步骤**：纯静态文件，直接由 HTTP 服务器托管
- **端口**：由 `DEPLOY_RUN_PORT` 环境变量决定（主仓固定 5000）

## 项目结构
```
.
├── index.html          # 主页面（首页 + 问卷 + 结果页，三段式 section 切换）
├── app.js              # 核心业务逻辑（状态管理、表单、标签生成、导出）
├── styles/
│   └── main.css        # 全局样式（Design Tokens、布局、组件、响应式）
├── .coze               # 项目配置文件（native-static 模板）
└── DESIGN.md           # 设计规范文件
```

## 核心功能模块

### 页面路由（app.js）
- `showPage(pageId)`：切换 home / questionnaire / results 三个 section
- 状态变量 `state` 管理所有表单数据

### 问卷流程（4 步）
1. **Step 1**：Business Info（名称、地址、电话）
2. **Step 2**：Product Details（产品名、净重、配料、过敏原）
3. **Step 3**：Storage（是否冷藏 → 显示 DSHS 注册字段）
4. **Step 4**：Sales Channel（直销/第三方/两者 → 显示法规提示）

### 标签生成（app.js `generateLabelHTML()` / `generateLabelText()`）
- 强制免责声明：`THIS PRODUCT WAS PRODUCED IN A PRIVATE RESIDENCE...`
- 冷藏食品：额外添加 DSHS 注册号 + 生产日期 + 安全处理说明
- 第三方销售：额外添加生产日期

### 导出功能
- **复制文本**：`navigator.clipboard.writeText()` + fallback
- **下载 TXT**：Blob + URL.createObjectURL + `<a>` download
- **下载 PNG**：html2canvas 渲染 label-preview DOM 为图片

## 代码风格
- 使用 ES6+ 语法（const/let、箭头函数、模板字符串、async/await）
- CSS 使用 CSS Variables 管理 Design Tokens
- 命名规范：camelCase（JS）、kebab-case（CSS class、HTML id）
- 所有用户输入通过 `escapeHTML()` 防 XSS

## 设计规范
- 详见 `DESIGN.md`
- 暖色系（主色 #C75B39 陶土色）、移动端优先、卡片式布局
- 字体：Playfair Display（标题）+ Inter（正文），通过 Google Fonts CN 加载

## 注意事项
- 纯前端项目，无后端 API，无需接口测试
- html2canvas 通过 CDN 加载，PNG 导出依赖此库
- 法规数据硬编码在 `app.js` 中（年收入上限 $150,000、免责声明措辞等）
