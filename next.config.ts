import "./env";

import "@shopify/shopify-api/adapters/node";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** 禁用 turbopack */
  turbopack: {},
  reactStrictMode: true,
  /** 禁用 dev indicators */
  devIndicators: false,
  /** 启用 react Compiler 编译 */
  reactCompiler: true,
  /** 转译包 */
  transpilePackages: [
    "antd",
    "@ant-design/cssinjs",
    "@ant-design/pro-components",
  ],
  env: {
    CONFIG_SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    CONFIG_SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
    CONFIG_SHOPIFY_API_OPTIONAL_SCOPES: JSON.stringify(
      process?.env?.SHOPIFY_API_OPTIONAL_SCOPES,
    ),
  },
  allowedDevOrigins: [
    process.env.SHOPIFY_APP_URL?.toString().replace("https://", "") || "",
  ],
};

export default nextConfig;
