# Server 模块文档

## 概述

`src/server/` 目录包含了 Shopify 应用的后端核心逻辑，采用领域驱动设计（DDD）架构，主要分为四个模块：

- **shopify/**: Shopify API 相关的核心功能
- **middleware/**: 请求验证和初始化中间件
- **lib/**: 基础设施层（数据库客户端）
- **utils/**: 通用工具函数

## 目录结构

```
src/server/
├── shopify/                   # Shopify 核心功能模块（领域驱动）
│   ├── session.ts            # 会话管理
│   ├── client.ts             # 客户端提供者
│   ├── install.ts            # 应用安装处理
│   ├── config.ts             # Shopify API 配置
│   └── webhook/              # Webhook 处理器
│       └── app-uninstalled.ts
│
├── middleware/                # 中间件
│   ├── auth/                 # 认证相关中间件
│   │   ├── verify-request.ts
│   │   ├── verify-checkout.ts
│   │   ├── verify-hmac.ts
│   │   └── verify-proxy.ts
│   ├── init.ts               # 初始化中间件
│   └── index.ts              # 中间件组合器
│
├── lib/                       # 核心库/基础设施
│   └── database.ts           # Prisma 客户端
│
└── utils/                     # 通用工具函数
    ├── auth/                 # 认证工具
    │   ├── cryption.ts       # 加密/解密工具
    │   ├── index.ts          # 认证工具导出
    │   └── validate-jwt.ts   # JWT 验证
    └── env.ts                # 环境变量验证
```

## 核心模块

### 1. Shopify 模块 (`shopify/`)

#### 1.1 配置 (`config.ts`)

Shopify API 的核心配置，包括：

- API 密钥和密钥
- 权限范围（Scopes）
- API 版本
- 嵌入式应用配置
- Webhook 配置
- Metafields 声明

**使用示例：**

```typescript
import shopify from "@/server/shopify/config";

// 访问 Shopify API 实例
const client = new shopify.clients.Graphql({ session });
```

#### 1.2 会话管理 (`session.ts`)

管理 Shopify 会话的存储、加载和删除：

- `storeSession(session)`: 存储会话到数据库（加密存储）
- `loadSession(id)`: 从数据库加载会话（自动解密）
- `deleteSession(id)`: 删除会话

**使用示例：**

```typescript
import sessionHandler from "@/server/shopify/session";
import { Session } from "@shopify/shopify-api";

// 存储会话
await sessionHandler.storeSession(session);

// 加载会话
const session = await sessionHandler.loadSession(sessionId);

// 删除会话
await sessionHandler.deleteSession(sessionId);
```

#### 1.3 客户端提供者 (`client.ts`)

提供在线（online）和离线（offline）访问的 GraphQL 和 Storefront 客户端。

**API：**

- `clientProvider.offline.graphqlClient({ shop })`: 创建离线 GraphQL 客户端
- `clientProvider.offline.storefrontClient({ shop })`: 创建离线 Storefront 客户端
- `clientProvider.online.graphqlClient({ req, res })`: 创建在线 GraphQL 客户端
- `clientProvider.online.storefrontClient({ req, res })`: 创建在线 Storefront 客户端

**使用示例：**

```typescript
import clientProvider from "@/server/shopify/client";

// 离线 GraphQL 客户端（后台任务、Webhook）
const { client, shop, session } = await clientProvider.offline.graphqlClient({
  shop: "example.myshopify.com",
});

const response = await client.query({
  data: `{
    shop {
      name
    }
  }`,
});

// 在线 GraphQL 客户端（用户请求）
const { client, shop, session } = await clientProvider.online.graphqlClient({
  req,
  res,
});
```

#### 1.4 安装处理 (`install.ts`)

处理应用的新安装和重新安装逻辑。

**使用示例：**

```typescript
import freshInstall from "@/server/shopify/install";

// 在初始化中间件中调用
await freshInstall({ shop: "example.myshopify.com" });
```

#### 1.5 Webhook 处理器 (`webhook/`)

处理 Shopify Webhook 事件。

**现有 Webhook：**

- `app-uninstalled.ts`: 处理应用卸载事件

**添加新 Webhook：**

1. 在 `shopify/webhook/` 目录创建新的处理器文件
2. 在 `shopify/config.ts` 的 `user.webhooks` 数组中注册

**示例：**

```typescript
// shopify/webhook/my-webhook.ts
const myWebhookHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string,
): Promise<void> => {
  const data = JSON.parse(webhookRequestBody);
  // 处理 webhook 数据
};

export default myWebhookHandler;
```

### 2. 中间件 (`middleware/`)

#### 2.1 认证中间件 (`auth/`)

##### `verify-request.ts`

验证嵌入应用的请求，检查授权头并验证会话。

**功能：**

- 验证 JWT Token
- 获取或刷新在线会话
- 将会话和店铺信息附加到请求对象（`req.user_session`, `req.user_shop`）

**使用：**

```typescript
import withMiddleware from "@/server/middleware";
import verifyRequest from "@/server/middleware/auth/verify-request";

export default withMiddleware(verifyRequest)(async (req, res) => {
  // req.user_session 和 req.user_shop 可用
  const shop = req.user_shop;
});
```

##### `verify-checkout.ts`

验证 Checkout Extension 请求。

**功能：**

- 验证 JWT Token
- 提取店铺信息
- 附加店铺信息到请求对象（`req.user_shop`）

**使用：**

```typescript
import verifyCheckout from "@/server/middleware/auth/verify-checkout";

export default withMiddleware(verifyCheckout)(async (req, res) => {
  const shop = req.user_shop;
});
```

##### `verify-hmac.ts`

验证 Webhook 请求的 HMAC 签名。

**功能：**

- 验证 `X-Shopify-Hmac-Sha256` 头
- 确保请求来自 Shopify

**使用：**

```typescript
import verifyHmac from "@/server/middleware/auth/verify-hmac";

export default withMiddleware(verifyHmac)(async (req, res) => {
  // Webhook 数据已通过验证
  const data = req.body;
});
```

##### `verify-proxy.ts`

验证应用代理请求的签名。

**功能：**

- 验证查询参数中的签名
- 提取店铺信息
- 附加店铺信息到请求对象（`req.user_shop`）

**使用：**

```typescript
import verifyProxy from "@/server/middleware/auth/verify-proxy";

export default withMiddleware(verifyProxy)(async (req, res) => {
  const shop = req.user_shop;
});
```

#### 2.2 中间件组合器 (`index.ts`)

使用 `next-api-middleware` 组合多个中间件。

**使用示例：**

```typescript
import withMiddleware from "@/server/middleware";

export default withMiddleware(
  verifyRequest,
  verifyHmac,
)(async (req, res) => {
  // 多个中间件按顺序执行
});
```

#### 2.3 初始化中间件 (`init.ts`)

处理应用的初始加载，用于 `getServerSideProps`。

**功能：**

- 检测初始安装（通过 `id_token` 查询参数）
- 执行 Token 交换（获取在线和离线 Token）
- 检查是否为新安装并执行安装逻辑

**使用示例：**

```typescript
// pages/index.tsx
import isInitialLoad from "@/server/middleware/init";

export async function getServerSideProps(context) {
  return await isInitialLoad(context);
}
```

### 3. 基础设施 (`lib/`)

#### 3.1 数据库客户端 (`database.ts`)

Prisma 客户端实例，配置了 PostgreSQL 适配器。

**使用示例：**

```typescript
import prisma from "@/server/lib/database";

// 使用 Prisma 客户端
const store = await prisma.stores.findUnique({
  where: { shop: "example.myshopify.com" },
});
```

### 4. 工具函数 (`utils/`)

#### 4.1 环境变量验证 (`env.ts`)

验证所有必需的环境变量是否已正确配置。

**功能：**

- 检查 Shopify API 配置
- 检查数据库连接
- 检查加密字符串
- 验证应用配置（名称、句柄、代理设置）

**使用：**

```typescript
import setupCheck from "@/server/utils/env";

// 在应用启动时调用
setupCheck();
```

#### 4.2 认证工具 (`utils/auth/`)

##### `cryption.ts`

提供会话数据的加密和解密功能。

**使用：**

```typescript
import { cryption } from "@/server/utils/auth";

const encrypted = cryption.encrypt(JSON.stringify(data));
const decrypted = JSON.parse(cryption.decrypt(encrypted));
```

##### `validate-jwt.ts`

验证 Shopify JWT Token。

**使用：**

```typescript
import { validateJWT } from "@/server/utils/auth";

const payload = validateJWT(token);
const shop = payload.dest;
```

## 使用示例

### 完整的 API 路由示例

```typescript
// pages/api/products/index.ts
import withMiddleware from "@/server/middleware";
import verifyRequest from "@/server/middleware/auth/verify-request";
import clientProvider from "@/server/shopify/client";

export default withMiddleware(verifyRequest)(async (req, res) => {
  try {
    // 获取在线 GraphQL 客户端
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
    });

    // 执行 GraphQL 查询
    const response = await client.query({
      data: `{
        products(first: 10) {
          edges {
            node {
              id
              title
            }
          }
        }
      }`,
    });

    res.status(200).json(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### Webhook 处理示例

```typescript
// pages/api/webhooks/orders-create.ts
import withMiddleware from "@/server/middleware";
import verifyHmac from "@/server/middleware/auth/verify-hmac";

export default withMiddleware(verifyHmac)(async (req, res) => {
  try {
    const order = JSON.parse(req.body);

    // 处理订单创建逻辑
    console.log("订单创建:", order.id);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
```

### 后台任务示例（使用离线客户端）

```typescript
// pages/api/tasks/sync-products.ts
import clientProvider from "@/server/shopify/client";

export default async function handler(req, res) {
  try {
    const shop = req.query.shop as string;

    // 使用离线客户端（不需要用户会话）
    const { client } = await clientProvider.offline.graphqlClient({ shop });

    // 执行后台任务
    const response = await client.query({
      data: `{
        products(first: 250) {
          edges {
            node {
              id
              title
            }
          }
        }
      }`,
    });

    res
      .status(200)
      .json({ success: true, count: response.body.data.products.edges.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Task failed" });
  }
}
```

## 最佳实践

1. **会话管理**
   - 在线会话用于用户操作，会自动过期
   - 离线会话用于后台任务和 Webhook，不会过期
   - 所有会话数据都经过加密存储在数据库中

2. **中间件使用**
   - 总是使用适当的验证中间件保护 API 路由
   - `verifyRequest` 用于嵌入应用请求
   - `verifyHmac` 用于 Webhook
   - `verifyProxy` 用于应用代理

3. **客户端选择**
   - 使用在线客户端处理用户触发的操作
   - 使用离线客户端处理后台任务、定时任务和 Webhook

4. **错误处理**
   - 所有异步操作都应该有 try-catch
   - 记录详细的错误信息以便调试
   - 返回适当的 HTTP 状态码

5. **环境变量**
   - 在应用启动时运行 `setupCheck()` 验证所有必需的环境变量
   - 确保生产环境使用 HTTPS

## 注意事项

- 会话 ID 格式：离线会话使用 `offline_${shop}`，在线会话由 Shopify API 生成
- JWT Token 验证失败在开发环境中可能被忽略，但在生产环境中必须正确处理
- Webhook 处理器必须是幂等的（可以安全地多次执行）
- 数据库连接使用 Prisma PostgreSQL 适配器，需要正确配置 `DATABASE_URL`
