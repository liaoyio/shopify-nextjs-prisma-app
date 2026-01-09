# OAuth 到托管安装

Shopify 引入了 `Shopify 托管安装` 以消除身份验证期间的屏幕闪烁、获取在线会话时不必要的身份验证重定向以及其他各种问题。简单来说，您将访问令牌传递给 Shopify，并像常规获取一样获得会话令牌，然后将其保存到数据库中。以下是更改的内容：

1. 身份验证的更改

Shopify 仍然支持较旧的身份验证方式，但对于此仓库中的嵌入式应用，它已经消失，文件也是如此。我已经完全移除了运行身份验证的旧方式。

- `pages/api/auth/index.js`: 已移除。
- `pages/api/auth/token.js`: 已移除。
- `pages/api/auth/callback.js`: 已移除。

2. 更新 `isShopAvailable` 函数

`pages/index.jsx` 现在调用一个新函数 `isInitialLoad`，而不是 `isShopAvailable`。新方式意味着在首次加载时，我们获取 `id_token` 作为查询参数，该参数被交换为在线和离线会话令牌。`isInitialLoad` 检查这些参数是否存在，将它们交换为在线和离线令牌，并将它们保存到数据库中。

这里也发生了一个新检查，`isFreshInstall`。由于保持数据库结构相同以确保平滑过渡到新身份验证，我们现在可以检查安装是否是全新的。如果 `store` 模型中不存在该店铺，这是一个新安装，但如果它有一个 `Bool` 值，这意味着它已经安装或者是重新安装。虽然我已经在 if 条件中合并了这些，但您可以将它们分开，如果需要，运行您自己的检查。

```javascript
if (!isFreshInstall || isFreshInstall?.isActive === false) {
  // !isFreshInstall -> 新安装
  // isFreshInstall?.isActive === false -> 重新安装
  await freshInstall({ shop: onlineSession.shop });
}
```

由于 `getServerSideProps` 必须返回它，现在这后面跟着一个 `props` 返回。

3. `verifyRequest` 和 `ExitFrame` 的更改

`verifyRequest()` 中间件现在的工作方式完全不同。首先，我们在每个 `fetch()` 中检查 `authorization` 头，因为 App Bridge CDN 会自动向每个 `fetch` 添加头。然后运行 JWT 验证以确保头有效，然后获取会话 id 并从数据库读取，检查过期并在在线令牌过期时获取新令牌。然后将会话传递给后续路由使用，作为 `req.user_session`，中间件完成。

关于这一点的一个好处是 `ExitFrame` 不再存在。如果令牌无效，我们抛出 `401`，如果令牌过期，我们获取它们并继续下一步。

4. 快速身份验证 URL

快速身份验证 URL 已更新。我们从 `https://appurl.com/api/auth?shop=storename.myshopify.com` 迁移到 `https://storename.myshopify.com/admin/oauth/install?client_id=SHOPIFY_API_KEY`，这现在将商家带到安装屏幕。

5. 弃用 `useFetch()` hook

`useFetch()` 的想法是如果令牌已过期或未找到，则重定向到 `ExitFrame` - 这不再需要。所有普通的 `fetch` 请求都可以工作，因为 AppBridge CDN 在后台添加授权头。

6. 思考

托管安装很棒。没有闪烁，没有运行 ExitFrame，整体评价 10/10。唯一的问题是，现在当有人来到权限屏幕时，您不会收到提示，只有在批准权限时才被告知店铺。新的 `tomlWriter` 的构建使得您仍然只依赖您的 `env`，并将您的 `shopify.app.toml` 文件写入根目录（和 `extension/` 文件夹）。我花了一点时间来理解，但一旦您掌握了它，它就很棒。
