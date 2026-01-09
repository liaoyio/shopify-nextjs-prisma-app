import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  isServer: typeof window === "undefined",
  server: {
    /** Shopify App Config */
    SHOPIFY_API_KEY: z.string("❌ Shopify API Key 密钥未定义。"),
    SHOPIFY_API_SECRET: z.string("❌ Shopify API Secret 密钥未定义。"),
    SHOPIFY_API_SCOPES: z.string("❌ Shopify API 权限范围未定义。"),
    SHOPIFY_API_OPTIONAL_SCOPES: z.string().optional(),
    SHOPIFY_APP_URL: z.string("❌ Shopify App URL 未定义。"),
    SHOPIFY_API_VERSION: z.string("❌ Shopify API 请求版本未定义。"),
    DATABASE_URL: z.string("❌ 数据库 URL 未定义。"),
    ENCRYPTION_STRING: z.string().min(8).max(100).optional(),

    /** App Config */
    APP_NAME: z.string("❌ Shopify App Name 未定义。"),
    APP_HANDLE: z
      .string("❌ Shopify App Handle 未定义。")
      .regex(
        /^[a-zA-Z0-9-]+$/,
        "❌ Shopify App Handle 必须进行 URL 编码且不能包含空格。",
      ),

    /** App Proxy Config */
    APP_PROXY_PREFIX: z
      .enum(["apps", "a", "community", "tools"], {
        message:
          "❌ 无效的应用代理前缀，请确保值为以下之一: apps | a | community | tools",
      })
      .optional(),
    APP_PROXY_SUBPATH: z
      .string({
        message:
          "⚠️ 应用代理子路径未定义，将不会被使用。请确保您的应用不使用应用代理",
      })
      .optional(),

    /** POS Config */
    POS_EMBEDDED: z.enum(["true", "false"]).optional().default("false"),

    /** Direct API Config */
    DIRECT_API_MODE: z.enum(["online", "offline"]).optional().default("online"),
    EMBEDDED_APP_DIRECT_API_ACCESS: z
      .enum(["true", "false"])
      .optional()
      .default("false"),

    /** Node Environment Config */
    NODE_ENV: z
      .enum(["development", "production"])
      .optional()
      .default("development"),
  },
  client: {
  },
  experimental__runtimeEnv: {
  },
});
