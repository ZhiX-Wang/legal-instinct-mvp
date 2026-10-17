# Legal Instinct｜法律直觉

《你一生可能遇到的 100 个法律瞬间》的首版可玩网页。当前开放 5 个情境，每个情境包含四次选择、逐步展开的后果、具体结局、复盘、重选和法律依据链接。

## 本地运行

在 `dist/` 目录运行任意静态服务器，例如：

```bash
cd dist
python3 -m http.server 8765
```

随后访问 `http://127.0.0.1:8765/`。网页没有运行时依赖，也没有构建步骤。直接用浏览器打开 `index.html` 也可阅读；建议用静态服务器测试部署效果。

## 部署到自己的服务器

把整个 `dist/` 目录的内容上传到静态站点根目录即可。页面用 `#情境ID` 定位具体情境，无需服务器路由重写。Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.example;
    root /srv/legal-instinct/dist;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

上线时请为域名配置 HTTPS。若用 CDN、对象存储静态托管或其他 Web 服务器，仍只需部署 `dist/`。

## 内容和数据

- `dist/scenes.js`：前两幕、基础情境、复盘要点和原始依据链接。
- `dist/extensions.js`：后两幕、本局事实及具体结局。新增情境时同时扩展对应对象。
- `dist/app.js`：页面状态和选择流程。完成记录仅保存在访客浏览器的 `localStorage` 中，不会上传。
- `dist/styles.css`：响应式样式。
- `dist/assets/`：每个情境两组本地写实图片，覆盖开场、四轮选择与结局画面；图片为生成的教学示意，并非真实案件照片。
- `.openai/hosting.json`：Sites 私有预览所需的部署配置。迁移到自己的服务器时不需要此文件。

当前版本是人工编排的分支叙事，没有接入 AI 对话、账号或后端数据库。以后加入跨设备进度、内容管理和 AI NPC 时，可在自己的服务器上新增 API；现有静态前端可以保留。

法律内容适用中国大陆；头盔情境使用浙江省规定。场景文件的各项 `sources` 链接可用于版本更新时逐条复核。真实案件应以实际事实、当地有效规定和正式文书为准。
