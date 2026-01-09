# 设置

这是使用此仓库的深入指南。本文档介绍了如何启动和运行基础仓库，要了解如何添加您自己的服务器端自定义（如注册 webhook、路由等），请参考 [Notes](/docs/NOTES.md)。

- [ ] 运行 `npm run g:install` 安装全局依赖。
  - 这不需要每次都运行，但对于本地开发是必要的 - 安装 Shopify/app 和 Shopify/cli 包。更多信息请参阅 `package.json`。

- [ ] 运行 `npm i --force` 安装依赖。
  - 我们已投入大量努力确保使用最新的包版本，但在安装时总是会出现一些不兼容问题。目前对功能没有负面影响，但如果您发现任何问题，请提交 issue。

- [ ] 从您的 [Shopify 合作伙伴控制台](https://partners.shopify.com) 创建一个新应用（公开或自定义）。

- [ ] 基于 `.env.example` 构建您的 `.env` 文件。
  - `SHOPIFY_API_KEY`: 应用 API 密钥。
  - `SHOPIFY_API_SECRET`: 应用密钥。
  - `SHOPIFY_API_SCOPES`: Shopify 应用所需的权限范围。访问权限范围列表可在[此处](https://shopify.dev/api/usage/access-scopes)找到
  - `SHOPIFY_API_OPTIONAL_SCOPES`: Shopify 应用所需的可选权限范围。您可以在 `/debug/scopes` 查看它的运行情况。
  - `SHOPIFY_APP_URL`: 从 Ngrok/Cloudflare 生成的 URL。
  - `SHOPIFY_API_VERSION`: 预填充为最新版本。仓库中的所有调用都基于此 API 版本，因此如果您要降级，请参考官方文档。仓库始终与最新实践保持同步，因此您可以依赖基础仓库几乎总是能够正常工作，而不会出现弃用错误。
  - `DATABASE_URL`: 数据库连接 URL。由于我们在此仓库中使用 Prisma ORM，它支持 SQL 和 noSQL 数据库。在[此处](https://www.prisma.io/stack)了解更多信息
  - `ENCRYPTION_STRING`: 用于加密会话令牌的 Cryption 字符串。添加随机盐（或随机字母和数字字符串）并保存它。如果您丢失此字符串，将无法解密您的会话，必须安全保存。
  - `APP_NAME`: 您的应用名称，如您在合作伙伴控制台中输入的。
  - `APP_HANDLE`: 您的应用的 URL 句柄。
  - `APP_PROXY_PREFIX`: 应用代理路径的前缀，可以是以下之一：
    - apps
    - a
    - community
    - tools
  - `APP_PROXY_SUBPATH`: 应用代理的子路径。
    - 将 `APP_PROXY_PREFIX` 或 `APP_PROXY_SUBPATH` 留空，则不会创建应用代理条目。
  - `POS_EMBEDDED`: 布尔值。如果您的应用嵌入在 Shopify 销售点中。

- [ ] NPM 脚本
  - `dev`: 以开发模式运行
  - `build`: 构建生产版本
  - `start`: 以生产模式启动。启动前需要运行 `npm run build`。
  - `pretty`: 在整个项目上运行 `prettier`。
  - `update`: 强制更新所有包到最新版本，之后需要手动运行 `npm i --force`。如果您不知道自己在做什么，不推荐使用。
  -
  - `ngrok:auth`: 用您的 ngrok 令牌替换 `<auth-token-goes-here>` 并运行以激活 ngrok。
  - `ngrok`: 在端口 3000 上启动 ngrok。
  - `cloudflare`: 在端口 3000 上启动 cloudflare 隧道（确保已安装 `cloudflared`）。
  -
  - `g:install`: 构建 Shopify 应用所需的全局安装。
  - `shopify`: 运行 `shopify` 命令
  - `update:config`: [托管安装] 使用 Shopify CLI 更新您的配置。自动将您的 `toml` 文件写入根目录和 `extension/` 以进行同步。
  - `update:url`: [OAuth 安装] 使用 `@shopify/cli-kit` 更新 Shopify 合作伙伴控制台的 URL。需要正确设置 `.env` 文件。
  -
  - `pg:create`: 创建一个新文件夹 `database` 并初始化 PostgreSQL 实例。需要您已安装 postgres。
    - 运行 `brew install postgresql`
  - `pg:start`: 在 `database` 上启动 PostgreSQL 实例。需要您先运行 `npm run pg:create`。
  - `pg:stop`: 停止 PostgreSQL 服务器。
  -
  - `prisma`: 访问 `prisma` 命令的通用命令。
  - `prisma:push`: 将 `schema.prisma` 推送到您的 `DATABASE_URL` 数据库。
  - `prisma:pull`: 从 `DATABASE_URL` 数据库拉取数据库模式并生成 `schema.prisma` 文件。
  -
  - `prepare`: 生成 `@prisma/client` 的保留脚本。

- [ ] 设置合作伙伴控制台
  - 运行 `npm run ngrok` 或 `npm run cloudflare` 生成您的子域。复制 `https://<your-url>` 域名并将其添加到 `.env` 文件中的 `SHOPIFY_APP_URL`。
  - 运行 `npm run update:config` 创建并更新您的 `shopify.app.toml` 文件并与 Shopify 同步。
  - GPDR 处理程序位于 `page/api/gdpr/`，通过您的 toml 自动注册的 URL 是：
    - 客户数据请求: `https://<your-url>/api/gdpr/customers_data_request`
    - 客户删除: `https://<your-url>/api/gdpr/customers_redact`
    - 店铺删除: `https://<your-url>/api/gdpr/shop_redact`
  - 应用代理路由设置为允许直接从店铺访问您应用的数据。已设置示例代理路由，可在 `/pages/api/proxy_route` 找到。首先，您需要设置您的基础 URL。以下是使其工作的方法：
    - 子路径前缀: `apps` [在 env 中填写]
    - 子路径: `next-proxy` [在 env 中填写]
    - 代理 URL: `https://<your-url>/api/proxy_route` [由 `_developer/tomlWriter.js` 自动填充]

    - 因此，当商家访问 `https://shop-url.com/apps/next-proxy/` 时，该请求的响应将来自 `https://<your-url>/api/proxy_route`。已设置中间件来检查签名，因此您不必担心验证代理调用，可在 `utils/middleware/verifyProxy.js` 找到。
    - 随后，任何子请求都将以相同方式映射。对 `https://shop-url.com/apps/next-proxy/json` 的调用将路由到 `https://<your-url>/api/proxy_route/json`。
    - 要确认您是否正确设置了应用代理，请访问 `https://shop-url.myshopify.com/apps/next-proxy/json` 确认是否返回带有上述配置的 JSON^
    - 一个常见的*陷阱*是，如果您创建多个应用都使用相同的子路径（在这种情况下是 `next-proxy`），所有后续安装都会抛出 `404` 错误，因为 Shopify 基于安装序列化路由。为避免这种情况，请将子路径更改为您应用独有的内容。我更喜欢使用格式 `<<appname>>-proxy`

- [ ] 运行应用
  - 如果您是第一次连接到所述数据库，请运行 `npx prisma db push` 以使您的数据库正常工作。
  - 运行 `npm run dev`、您的数据库和 ngrok/cloudflare。
  - 通过访问 `https://storename.myshopify.com/admin/oauth/install?client_id=SHOPIFY_API_KEY` 安装应用。

- [ ] 设置扩展
  - 请参阅 [Extensions](./EXTENSIONS.md)
