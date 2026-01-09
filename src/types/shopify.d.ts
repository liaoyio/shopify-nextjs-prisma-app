/**
 * Webhook 处理函数类型
 */
export type WebhookHandler = (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string,
) => Promise<void>;

/**
 * Webhook 配置项
 */
export interface WebhookConfig {
  topics: readonly string[];
  url: string;
  callback: WebhookHandler;
  include_fields?: string[];
  filter?: string;
}

/**
 * Metafield 配置项（可根据需要扩展）
 */
export interface MetafieldConfig {
  // 根据实际需要定义
  [key: string]: any;
}

/**
 * Metaobject 配置项（可根据需要扩展）
 */
export interface MetaobjectConfig {
  // 根据实际需要定义
  [key: string]: any;
}

/**
 * 用户自定义配置
 */
export interface ShopifyUserConfig {
  webhooks: WebhookConfig[];
  metafields?: MetafieldConfig[];
  metaobjects?: MetaobjectConfig[];
}

export {};
