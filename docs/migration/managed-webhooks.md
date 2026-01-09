# 托管 Webhooks

我们（终于）有能力决定要接收哪些 webhook 以及要排除哪些。这有一些很好的影响，主要的一个是使用更少的计算资源，因此您的服务器成本更低。

## 迁移

### 文件

虽然所有这些都在一次提交中，但以下是更改的完整日志及其背后的原因：

- `isInitialLoad.js`
  我们不再需要 `webhookRegistrar` 函数来注册 webhook。所以现在我们不再进行该 GraphQL 调用来注册 webhook，应用的初始加载时间要快得多，有助于整体 LCP。

- `[...webhookTopic].js`
  这是一个自动生成的文件。它创建一个 `switch/case` 语句来处理所有您的 webhook 落地。如果您使用外部 HTTP 服务器、AWS EventBridge 或 Google PubSub，这将不包含 case，因为 `switch/case` 只处理到达此服务器的请求。

- `shopify.js`
  我们现在不再使用 `addHandlers()` 函数，而是将其作为 `shopify.user.webhooks` 传递，这不会影响基线的工作方式，这不是一个很大的更改，但您声明 webhook 主题的方式已经改变。

- `tomlWriter.js` 和 `webhookWriter.js`
  这是解析文件并创建 TOML 和其他配置的秘密武器。我强烈建议不要搞乱这个。

### GraphQL 到 TOML

- 托管 webhook 不会在您进行 GQL 调用以获取活动 webhook 时显示，因此 webhook 调试卡片现在没有用了。
- 如果您正在将您的实时项目从 `webhookRegistrar()` / 基于 GraphQL 的 webhook 迁移到托管 webhook，您需要手动删除旧的 webhook，否则两个 webhook 都会触发两次。

## 陷阱

- 过滤器 `:` 实际上是 `=` 而不是模糊搜索，与它遵循的 Shopify 搜索 API 的其余部分不同
- 权限范围错误有时需要多次推送。在 `shopify.js` 中注释掉 webhook，运行 `bun run update:config` 以推送您的访问权限范围，取消注释 webhook 并再次运行 `bun run update:config`，它将按预期工作。
