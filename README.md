# DevUtils

一个现代化的开发者工具集合，旨在提供便捷、高效的在线开发辅助功能。基于 Nuxt 4 和 Nuxt UI 构建，拥有极佳的性能和用户体验。

## ✨ 特性

- 🛠️ **多功能工具箱**：集成多种常用开发工具，满足日常开发需求。
- 🚀 **高性能**：基于 Nuxt 4 构建，加载速度快，响应迅速。
- 🎨 **现代化 UI**：使用 Nuxt UI 和 TailwindCSS v4，界面简洁美观，支持暗色模式。
- 🔍 **便捷导航**：内置工具搜索和快速切换功能，提升工作效率。
- 📱 **响应式设计**：完美适配桌面端和移动端设备。

## 🧰 当前可用工具

目前包含以下实用工具，更多工具正在持续开发中：

- **URL 编解码 (URL Codec)**: 快速对 URL 进行编码和解码操作。
- **UUID 生成器 (UUID Generator)**: 批量生成 UUID (v1, v4 等)，支持多种格式输出。

## 🛠️ 技术栈

本项目使用了以下核心技术：

- [Nuxt 4](https://nuxt.com) - 全栈 Vue 框架
- [Vue 3](https://vuejs.org) - 渐进式 JavaScript 框架
- [Nuxt UI](https://ui.nuxt.com) - 基于 Vue 和 Tailwind 的 UI 组件库
- [TailwindCSS v4](https://tailwindcss.com) - 原子化 CSS 框架
- [TypeScript](https://www.typescriptlang.org) - 类型安全的 JavaScript 超集
- [Pnpm](https://pnpm.io) - 快速、节省磁盘空间的包管理器

## 🚀 快速开始

### 前置要求

- Node.js (建议 LTS 版本)
- pnpm 包管理器

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

启动后，访问 `http://localhost:3000` 即可查看应用。

### 构建生产版本

```bash
pnpm build
```

构建完成后，可以使用 `node .output/server/index.mjs` 运行生产环境服务。

### 代码检查与格式化

```bash
pnpm lint
pnpm typecheck
```
