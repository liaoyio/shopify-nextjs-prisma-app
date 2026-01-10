import toml from '@iarna/toml'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import setupCheck from '@/server/utils/env'
import declarativeWriter from './declarative-writer'
import webhookWriter from './webhook-writer'

type AppConfig = {
  name?: string
  handle?: string
  client_id?: string
  application_url?: string
  embedded?: boolean
  extension_directories?: string[]
  auth?: {
    redirect_urls?: string[]
  }
  access_scopes?: {
    scopes?: string
    optional_scopes?: string[]
    use_legacy_install_flow?: boolean
  }
  access?: {
    admin?: {
      direct_api_mode?: string
      embedded_app_direct_api_access?: boolean
    }
  }
  webhooks?: {
    api_version?: string
    subscriptions?: any[]
    privacy_compliance?: {
      customer_data_request_url?: string
      customer_deletion_url?: string
      shop_deletion_url?: string
    }
  }
  app_proxy?: {
    url?: string
    prefix?: string
    subpath?: string
  }
  pos?: {
    embedded?: boolean
  }
  [key: string]: any
}

const config: AppConfig = {}

try {
  setupCheck() // 运行设置检查以确保所有环境变量可访问

  let appUrl = process.env.SHOPIFY_APP_URL
  if (appUrl?.endsWith('/')) {
    appUrl = appUrl.slice(0, -1)
  }
  // 全局配置
  config.name = process.env.APP_NAME
  config.handle = process.env.APP_HANDLE
  config.client_id = process.env.SHOPIFY_API_KEY
  config.application_url = appUrl
  config.embedded = true
  config.extension_directories = ['../extension/extensions/**']

  // 身份验证
  config.auth = {}
  config.auth.redirect_urls = [`${appUrl}/api/`]
  // 权限范围
  config.access_scopes = {}
  config.access_scopes.scopes = process.env.SHOPIFY_API_SCOPES
  if (process.env.SHOPIFY_API_OPTIONAL_SCOPES?.trim()) {
    config.access_scopes.optional_scopes
      = process.env.SHOPIFY_API_OPTIONAL_SCOPES.split(',')
        .map(scope => scope.trim())
        .filter(Boolean)
  }
  config.access_scopes.use_legacy_install_flow = false

  if (
    process.env.DIRECT_API_MODE
    && process.env.EMBEDDED_APP_DIRECT_API_ACCESS
  ) {
    // 访问
    config.access = {}
    config.access.admin = {}
    if (process.env.DIRECT_API_MODE) {
      config.access.admin.direct_api_mode = process.env.DIRECT_API_MODE
    }
    if (process.env.EMBEDDED_APP_DIRECT_API_ACCESS) {
      config.access.admin.embedded_app_direct_api_access
        = process.env.EMBEDDED_APP_DIRECT_API_ACCESS === 'true'
    }
  }

  // Webhook 事件版本始终匹配应用 API 版本
  config.webhooks = {}
  config.webhooks.api_version = process.env.SHOPIFY_API_VERSION

  // Webhooks
  webhookWriter(config)
  declarativeWriter(config)

  // GDPR URL
  config.webhooks.privacy_compliance = {}
  config.webhooks.privacy_compliance.customer_data_request_url = `${appUrl}/api/gdpr/customers-data-request`
  config.webhooks.privacy_compliance.customer_deletion_url = `${appUrl}/api/gdpr/customers-redact`
  config.webhooks.privacy_compliance.shop_deletion_url = `${appUrl}/api/gdpr/shop-redact`

  // 应用代理
  if (
    process.env.APP_PROXY_PREFIX?.length
    && process.env.APP_PROXY_SUBPATH?.length
  ) {
    config.app_proxy = {}
    config.app_proxy.url = `${appUrl}/api/proxy_route`
    config.app_proxy.prefix = process.env.APP_PROXY_PREFIX
    config.app_proxy.subpath = process.env.APP_PROXY_SUBPATH
  }

  // 销售点 (PoS)
  if (process.env.POS_EMBEDDED?.length && process.env.POS_EMBEDDED.length > 1) {
    config.pos = {}
    config.pos.embedded = process.env.POS_EMBEDDED === 'true'
  }

  // 写入 toml
  let str = toml.stringify(config)
  str = `# 避免直接写入 toml。请改用您的 .env 文件\n\n${str}`

  fs.writeFileSync(path.join(process.cwd(), 'shopify.app.toml'), str)
  console.log('已写入 TOML 到根目录')

  const extensionsDir = path.join('..', 'extension')

  config.extension_directories = ['./extensions/**']
  let extensionStr = toml.stringify(config)
  extensionStr = `# 避免直接写入 toml。请改用您的 .env 文件\n\n${extensionStr}`

  config.extension_directories = ['extension/extensions/**']
  let globalStr = toml.stringify(config)
  globalStr = `# 避免直接写入 toml。请改用您的 .env 文件\n\n${globalStr}`

  if (fs.existsSync(extensionsDir)) {
    fs.writeFileSync(
      path.join(process.cwd(), '..', 'shopify.app.toml'),
      globalStr,
    )
    console.log('已写入 TOML 到根目录')

    fs.writeFileSync(
      path.join(extensionsDir, 'shopify.app.toml'),
      extensionStr,
    )
    console.log('已写入 TOML 到扩展目录')
  }
} catch (e) {
  const error = e as Error
  console.error('---> 写入 toml 文件时发生错误')
  console.log(error.message)
}
