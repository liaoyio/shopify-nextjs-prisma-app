import type { ApiVersion, AuthScopes } from '@shopify/shopify-api'
import { LogSeverity, shopifyApi } from '@shopify/shopify-api'
import '@shopify/shopify-api/adapters/node'
import appUninstallHandler from './webhook/app-uninstalled'
import type { ShopifyUserConfig } from '@/types/shopify'

const isDev = process.env.NODE_ENV === 'development'

/** Shopify 配置 */
const baseShopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SHOPIFY_API_SCOPES as unknown as AuthScopes,
  hostName: process.env.SHOPIFY_APP_URL?.replace(/https:\/\//, '') || '',
  hostScheme: 'https',
  apiVersion: process.env.SHOPIFY_API_VERSION as ApiVersion,
  isEmbeddedApp: true,
  logger: { level: isDev ? LogSeverity.Info : LogSeverity.Error },
})

/** 向基础 shopify 对象添加自定义用户属性 */
const user: ShopifyUserConfig = {
  webhooks: [
    {
      topics: ['app/uninstalled'] as const,
      url: '/api/webhooks/app-uninstalled',
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
    // 支持即将推出
  ],
}

/** 扩展 shopify 对象，使其包含 user 属性 */
type Shopify = typeof baseShopify & { user: ShopifyUserConfig }

const shopify: Shopify = {
  ...baseShopify,
  user,
}

export default shopify
