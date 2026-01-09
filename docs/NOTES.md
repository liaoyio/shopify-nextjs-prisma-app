# 笔记

## API

- 您的所有 API 都需要使用中间件。对于 App Proxy，使用 `export default withMiddleware("verifyProxy")(handler)`，对于 Apps 路由（常规后端），使用 `export default withMiddleware("verifyRequest")(handler);`。
- 示例实现可在 `pages/api/proxy_route/json.js` 和 `pages/api/apps/index.js` 中找到
- 如果您不使用中间件，您的应用将被拒绝，并且在没有上下文的情况下运行 API 是不安全的。

## Webhooks

- 如果您来自[此处](https://github.com/kinngh/shopify-node-express-mongodb-app)可用的 Mongo 仓库，处理 webhook 的方式已经有所改变。
- 要添加您的 webhook，请前往 `utils/shopify.js` 并在底部添加所有您的 webhook 和处理程序。
- 我建议将 webhook 处理（除了 `APP_UNINSTALLED`）卸载到不同的服务，如 Google PubSub、AWS EventBridge 或 Cloudflare Workers，这样如果您要大规模构建，可以处理可能处理的大量 webhook，比如黑色星期五等应用受到考验的时候。

## Next.js

- 如果您不确定哪些代码会被发送到浏览器，请查看 [Next.js 代码消除工具](https://next-code-elimination.vercel.app)
