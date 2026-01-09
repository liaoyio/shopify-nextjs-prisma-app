# clientProvider

`clientProvider` 抽象已经进行了改造以简化 API。它不再公开 `graphqlClient` 和 `restClient` 函数，而是具有包含 `online` 和 `offline` 对象的命名空间。每个对象都包含一个 `graphqlClient` 和 `restClient` 函数，可用于为相应的访问模式创建客户端。

## 用法

### 在线客户端

```javascript
import clientProvider from "@/utils/clientProvider";

const { client, shop, session } = await clientProvider.online.graphqlClient({
  req,
  res,
});

const { client, shop, session } = await clientProvider.online.restClient({
  req,
  res,
});
```

### 离线客户端

```javascript
import clientProvider from "@/utils/clientProvider";

const { client, shop, session } = await clientProvider.offline.graphqlClient({
  shop: req.user_shop,
});

const { client, shop, session } = await clientProvider.offline.restClient({
  shop: req.user_shop,
});
```

## 步骤

1. 进入 `verifyRequest` 并在 `req.user_session = session;` 之后添加 `req.user_shop = session.shop`。
2. 将您的 `graphqlClient` 和 `restClient` 调用更新为 `clientProvider.online.graphqlClient` / `clientProvider.offline.graphqlClient` 和 `clientProvider.online.restClient` / `clientProvider.offline.restClient`
