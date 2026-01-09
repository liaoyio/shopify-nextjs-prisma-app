import shopify from '../src/utils/shopify'

type DeclarativeMetafieldDefinition = {
  owner_type: string
  key: string
  namespace?: string
  name: string
  description?: string
  type: string
  access?: {
    admin?: string
    storefront?: string
    customer_account?: string
  }
  capabilities?: {
    admin_filterable?: boolean
    unique_values?: boolean
  }
  validations?:
    | Array<{
      name: string
      value: string
    }>
    | Record<string, any>
    | string
}

type AppConfig = {
  [key: string]: any
}

/**
 * 将声明式元字段定义写入 TOML 配置对象。
 *
 * @param config - TOML 配置对象
 * @param shopifyInstance - 包含用户元字段的 shopify 实例
 */
function declarativeWriter(config: AppConfig): void {
  try {
    if (!config || typeof config !== 'object') return

    const metafields = (shopify as any)?.user?.metafields as
      | DeclarativeMetafieldDefinition[]
      | undefined
    if (!Array.isArray(metafields) || metafields.length === 0) return

    for (const def of metafields) {
      if (!def || typeof def !== 'object') continue

      const owner = def.owner_type
      const namespace = def.namespace || 'app'
      const key = def.key

      if (!owner || !namespace || !key) continue

      // 确保路径: config[owner].metafields[namespace]
      config[owner] = config[owner] || {}
      config[owner].metafields = config[owner].metafields || {}
      config[owner].metafields[namespace]
        = config[owner].metafields[namespace] || {}

      const out: Record<string, any> = {}
      out.name = def.name
      out.description = def.description ?? ''
      out.type = def.type

      if (def.access && typeof def.access === 'object') {
        out.access = {}

        if (def.access.admin) out.access.admin = def.access.admin
        if (def.access.storefront) {
          out.access.storefront = def.access.storefront
        }
        if (def.access.customer_account) {
          out.access.customer_account = def.access.customer_account
        }

        if (Object.keys(out.access).length === 0) delete out.access
      }

      if (def.capabilities && typeof def.capabilities === 'object') {
        out.capabilities = {}

        if (typeof def.capabilities.admin_filterable === 'boolean') {
          out.capabilities.admin_filterable = def.capabilities.admin_filterable
        }

        if (typeof def.capabilities.unique_values === 'boolean') {
          out.capabilities.unique_values = def.capabilities.unique_values
        }

        if (Object.keys(out.capabilities).length === 0) delete out.capabilities
      }

      if (def.validations != null) {
        if (Array.isArray(def.validations)) {
          const validationsTable: Record<string, any> = {}

          for (const v of def.validations) {
            if (!v || typeof v !== 'object') continue

            const name
              = typeof v.name === 'string' ? v.name.trim() : String(v.name || '')
            if (!name) continue

            const value = (v as any).value

            // 跳过 null/undefined/空字符串值
            if (value == null) continue
            if (typeof value === 'string' && !value.trim()) continue

            validationsTable[name] = value
          }

          if (Object.keys(validationsTable).length > 0) {
            out.validations = validationsTable
          }
        } else if (
          def.validations
          && typeof def.validations === 'object'
          && !Array.isArray(def.validations)
        ) {
          if (Object.keys(def.validations).length > 0) {
            out.validations = def.validations
          }
        } else if (typeof def.validations === 'string') {
          if (def.validations.trim()) out.validations = def.validations
        }
      }

      config[owner].metafields[namespace][key] = out
    }
  } catch (e) {
    const error = e as Error
    console.error('---> 写入声明式元字段时发生错误')
    console.log(error?.message || error)
  }
}

export default declarativeWriter
