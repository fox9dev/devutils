# DevUtils

DevUtils 是一个面向开发者的在线工具站，聚焦本地处理、即开即用和高频小工具场景。项目基于 Nuxt 4 构建，覆盖编码转换、文本处理、时间处理、颜色转换、安全辅助等常见开发需求。

在线地址：<https://devutils.fox9.dev>

## ✨ 特性

- 本地处理优先：输入内容默认在浏览器本地完成计算，不依赖后端服务。
- 开发者高频工具集合：围绕日常开发中的格式化、转换、校验、生成、解析等场景设计。
- 快速检索与切换：工具通过统一元数据驱动，便于搜索、导航和扩展。
- 响应式界面：桌面端和移动端都可直接使用。
- 易于扩展：新增工具只需按约定在 workspace 下增加页面并声明 tool 元数据。

## 🧰 当前工具

目前已包含以下工具：

### 编码与格式化

- YAML 格式化：YAML 格式化、压缩、校验，以及 YAML 与 JSON 双向转换。
- JSON 格式化：JSON 格式化、压缩、校验与美化。
- Base64 编解码：文本 Base64 编码与解码。
- URL 编解码：支持 encodeURI 和 encodeURIComponent 两种模式。
- HTML 实体编解码：特殊字符与 HTML 实体互转。

### 文本与内容处理

- 文本对比：支持逐字、逐词、逐行对比并高亮差异。
- 文本统计：统计字符数、单词数、行数、段落数和阅读时间。
- 正则测试器：实时测试正则表达式并展示匹配结果与捕获组。
- Lorem 生成器：按段落、句子、单词生成占位文本。
- Unicode 查询：查看字符码点、UTF-8、UTF-16 等编码信息。

### 时间与调度

- 时间戳转换：Unix 时间戳与日期时间互转，支持秒和毫秒。
- Cron 解析器：将 Cron 表达式解析为自然语言并计算后续执行时间。

### 数值与样式

- 进制转换：二进制、八进制、十进制、十六进制互转。
- CSS 单位转换：px、rem、em、pt、vw、vh 等单位换算。
- 颜色转换：HEX、HEX8、RGB、HSL、HSV、CMYK、OKLCH 互转并实时预览。

### 安全与标识

- Hash 摘要：计算文本或文件的 MD5、SHA-1、SHA-256、SHA-384、SHA-512 摘要。
- JWT 解码器：解析 JWT Header 和 Payload，检查过期时间。
- 密码生成器：生成可配置长度和字符集的随机密码。
- UUID 生成器：支持 v1、v3、v4、v5、v6、v7 多版本 UUID 批量生成。

## 🛠️ 技术栈

- Nuxt 4
- Vue 3
- Nuxt UI
- TailwindCSS v4
- TypeScript
- pnpm
- dayjs
- diff
- colord
- uuid
- yaml

## 🚀 本地开发

### 环境要求

- Node.js 20 或更高版本
- pnpm 10 或更高版本

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

默认访问地址：<http://localhost:3000>

### 构建生产版本

```bash
pnpm build
```

### 本地预览生产构建

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
pnpm typecheck
```

## 📁 项目结构

```text
app/
	components/          通用 UI 组件
	composables/         工具检索与状态管理
	layouts/             页面布局
	pages/
		index.vue          落地页
		tools.vue          工具总览页
		workspace/         各个工具页面
	types/               类型定义
public/                静态资源
```

## ➕ 如何新增工具

新增工具时，遵循当前项目约定：

1. 在 app/pages/workspace 下新增一个 kebab-case 命名的页面文件。
2. 在页面中通过 definePageMeta 声明 tool 元数据，包括 id、icon、name、description、keywords。
3. 补充 useSeoMeta，保持页面标题、描述和 og 信息完整。
4. 尽量保持本地处理，不引入后端依赖。
5. 复用现有组件和交互模式，例如复制、清空、交换、错误提示等。

## 📄 License

[MIT](./LICENSE)
