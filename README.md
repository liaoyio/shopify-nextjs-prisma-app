# Shopify Next.js x Prisma 模板

一个嵌入式应用启动模板，用于使用 Next.js 和 Prisma 进行 Shopify 应用开发。

我已经在此仓库中包含了[笔记](/docs/NOTES.md)，解释了为什么做出某些选择。

## 视频

我制作了一个视频，介绍了整个仓库，创建主题扩展并使用 Vercel 和 PlanetScale 进行部署。

[![从零开始创建 Shopify 应用](https://i3.ytimg.com/vi/vm8RTN-QSEk/maxresdefault.jpg)](https://www.youtube.com/watch?v=vm8RTN-QSEk)

## 相关仓库

- [`@kinngh/shopify-node-express-mongodb-app`](https://github.com/kinngh/shopify-node-express-mongodb-app): 使用 Express.js、React.js 和 Vite 构建的 Shopify 应用启动仓库。
- [`@kinngh/shopify-polaris-playground`](https://github.com/kinngh/shopify-polaris-playground): 在没有网络连接的情况下使用 Polaris 构建应用 UI。

## 为什么创建这个

使用 Express 和 React 构建很棒，但最终你会意识到需要跟上时代，使用新的、稳定的技术。无服务器架构很有意义，而 Next.js 更是如此。

## 笔记

- 参考 [SETUP](/docs/SETUP.md)
- 项目包含代码片段以加快开发速度。参考 [Snippets](/docs/SNIPPETS.md)。
- App Bridge CDN 迁移指南可在[此处](/docs/migration/app-bridge-cdn.md)找到
- Shopify 托管安装迁移指南可在[此处](/docs/migration/oauth-to-managed-installation.md)找到
- 客户端提供者抽象更新指南可在[此处](/docs/migration/clientProvider.md)找到
- GraphQL 到托管 Webhooks 迁移指南可在[此处](/docs/migration/managed-webhooks.md)找到
