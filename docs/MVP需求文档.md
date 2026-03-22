# Image Background Remover - MVP 需求文档

## 📄 在线文档

**飞书文档链接**：[Image Background Remover - MVP需求文档](https://feishu.cn/docx/GwrjdQ8i4owydMx3ifDcyFynnZf)

---

## 文档内容概要

### 1. 产品概述
- 产品名称：BG Remover
- 核心功能：一键移除图片背景，下载透明PNG
- 目标用户：设计师、电商卖家、自媒体创作者

### 2. 技术方案
- **架构**：用户浏览器 → Cloudflare Pages → Cloudflare Workers → Remove.bg API
- **前端**：Next.js + Tailwind CSS
- **后端**：Cloudflare Workers
- **API**：Remove.bg（$0.09/张）

### 3. 功能清单
- P0：图片上传、格式校验、背景移除、结果预览、一键下载
- 暂不做：用户系统、批量处理、历史记录

### 4. 开发计划
约 4 个工作日完成 MVP
