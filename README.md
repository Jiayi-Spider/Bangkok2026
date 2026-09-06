# 2026 Bangkok Trip Planner

一个为 iPhone 17 Pro 优化的纯静态曼谷旅行网页。项目无需后端，可部署到任何静态网站服务。

## 修改每日行程

日常只需编辑 schedule.md 中的 Markdown 表格：

- 每一行代表一个行程项目。
- 同一天可以添加多行。
- “天数、日期、主题、时间、行程、地图搜索词”六列不要删除或调换。
- 保存并上传 schedule.md 后，部署版网页会自动读取新行程。
- 地图搜索词建议使用地点的英文官方名称，以提高 Apple Maps 和 Google Maps 的搜索准确度。
- 如果直接双击 index.html，浏览器会使用内置回退行程；通过 GitHub Pages 等网站访问时才会自动读取 schedule.md。
- bangkok_trip_offline.html 是独立快照。修改 schedule.md 后，需要重新生成它才能同步。

## 本地预览

直接打开 index.html 可以查看页面内容。PWA 离线缓存需要 HTTPS，因此请在部署后测试“添加到主屏幕”。

## GitHub Pages

1. 在 GitHub 创建一个 repository。
2. 将本项目中的所有文件和文件夹上传到 repository 根目录。
3. 打开 repository 的 Settings。
4. 在左侧选择 Pages。
5. 在 Build and deployment 中选择 Deploy from a branch。
6. Branch 选择 main，文件夹选择 / (root)，然后保存。
7. 等待部署完成，在 Pages 页面获取网页地址。

## Cloudflare Pages

1. 登录 Cloudflare Dashboard，进入 Workers & Pages。
2. 选择 Create application → Pages → Upload assets。
3. 输入项目名称，将完整的项目文件夹拖入上传区域。
4. 点击部署。该项目是纯静态网页，无需构建命令。

## Netlify

1. 登录 Netlify，打开站点创建页面。
2. 将完整项目文件夹直接拖入部署区域。
3. 等待上传完成并获取 Netlify 网页地址。

## 在 iPhone 添加到桌面

1. 使用 Safari 打开部署后的网址。
2. 点击 Safari 的“分享”按钮。
3. 选择“添加到主屏幕”。
4. 名称设置为 BKK 2026，然后点击“添加”。

首次成功访问后，主要页面资源会被缓存，可在断网时继续打开。更新静态文件后，请修改 service-worker.js 中的 CACHE_NAME（例如改为 bkk-2026-v2），让设备获取新版本。

## 文件说明

- index.html：页面结构
- style.css：视觉与响应式样式
- script.js：行程状态、导航及 PWA 注册
- schedule.md：每日行程唯一编辑入口
- manifest.json：PWA 应用信息
- service-worker.js：离线缓存
- assets/：关键页面图片
- icons/：主屏幕图标
- bangkok_trip_offline.html：无需其他文件的 iPhone 单文件版
