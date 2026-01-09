# App Bridge CDN 迁移指南

从 App Bridge React 迁移到 CDN 非常简单直接，并不是一个令人畏惧的任务。

1. 卸载 `@shopify/app-bridge` 和 `@shopify/app-bridge-react` 包。这将在 `pages/_document.js` 文件中通过从 Shopify 的 CDN 导入 AppBridge 来替换。
2. `<NavigationMenu />` 现在是 `<ui-nav-menu>...</ui-nav-menu>`，它接受一系列 `<a>...</a>` 或对于 Next.js 来说，`<Link>...</Link>` 标签。
3. `AppBridgeProvider` 现在只是一个检查 `shop` 是否存在的检查。我们这样做是为了阻止应用的基础 URL 在没有店铺的情况下可访问。
4. 不再需要使用 `useNavigate()` 或 `Redirect.app`。使用 `open()` 按预期工作。您可以在调试卡片和退出框架中看到此示例。
5. 使用新的资源选择器可能有点挑战。使用它的一个好方法是将资源选择器封装在异步函数中，而不是返回值，更新您的状态变量以考虑更改。我将来会为此添加一个示例。

## 其他升级

1. `useFetch` hook 进行了更新以更加可靠。我们现在传递不依赖于 Shopify/AppBridge 处理的不同头，使其更加可靠。您对 `useFetch` hook 的使用不会改变，只需放入新的 `useFetch` hook，您就可以继续了。
2. `/exitframe/[...shop].js` 有可靠性更改。您可能想要更新其中的组件以更好地了解重新授权过程。
3. 旧的 Polaris 元素已替换为更新的元素。
4. `verifyRequest` 现在也检查权限范围更改。在开发模式下，您可能需要终止开发服务器并重新启动以使 env 正确生效，否则您将陷入无限的身份验证循环。
5. `pages/api/auth` 有新的更改。它旨在成为直接替换，因此只需用新文件替换现有文件，并添加您的更改。
6. 调试卡片已重命名和刷新，以提高清晰度和示例。
