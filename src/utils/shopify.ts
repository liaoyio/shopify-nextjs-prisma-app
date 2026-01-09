import { LogSeverity, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import appUninstallHandler from "./webhooks/app_uninstalled";
import type { ShopifyUserConfig } from "@/types/shopify";

const isDev = process.env.NODE_ENV === "development";

// 设置 Shopify 配置
const baseShopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SHOPIFY_API_SCOPES,
  hostName: process.env.SHOPIFY_APP_URL?.replace(/https:\/\//, "") || "",
  hostScheme: "https",
  apiVersion: process.env.SHOPIFY_API_VERSION,
  isEmbeddedApp: true,
  logger: { level: isDev ? LogSeverity.Info : LogSeverity.Error },
});

//向基础 shopify 对象添加自定义用户属性
const user: ShopifyUserConfig = {
  webhooks: [
    {
      topics: ["app/uninstalled"] as const,
      url: "/api/webhooks/app_uninstalled",
      callback: appUninstallHandler,
    },
  ],
  metafields: [
    // {
    //   owner_type: "product",
    //   key: "key_name",
    //   name: "最后同步时间",
    //   description: "这是一个描述",
    //   type: "number_integer",
    //   access: {
    //     admin: "merchant_read_write",
    //     customer_account: "read_write",
    //   },
    //   capabilities: {
    //     admin_filterable: true,
    //     unique_values: false,
    //   },
    //   validations: [
    //     {
    //       //文档: https://shopify.dev/docs/apps/build/metafields/list-of-validation-options
    //       name: "max",
    //       value: "10",
    //     },
    //     {
    //       name: "min",
    //       value: "1",
    //     },
    //   ],
    // },
  ],
  metaobjects: [
    //支持即将推出。
  ],
};

// 使用类型断言来扩展 shopify 对象，使其包含 user 属性
const shopify = {
  ...baseShopify,
  user,
} as typeof baseShopify & { user: ShopifyUserConfig };

export default shopify;
