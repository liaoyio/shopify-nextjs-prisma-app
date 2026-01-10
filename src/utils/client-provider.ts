import sessionHandler from './session-handler'
import shopify from './shopify'
import type { Handle } from '@/types'

/**
 * 获取与店铺关联的离线会话。
 * @async
 * @param shop - 店铺域名。
 */
const fetchOfflineSession = async (shop: string) => {
  const sessionID = shopify.session.getOfflineId(shop)
  const session = await sessionHandler.loadSession(sessionID)
  return session
}

/**
 * 提供创建离线访问客户端的方法。
 * @namespace offline
 */
const offline = {
  /**
   * 创建用于离线访问的 Shopify GraphQL 客户端。
   * @async
   * @param params - 请求和响应对象。
   * @param shop - 店铺域名
   */
  graphqlClient: async ({ shop }: { shop: string }) => {
    const session = await fetchOfflineSession(shop)
    if (!session) {
      throw new Error('加载离线会话失败')
    }
    const client = new shopify.clients.Graphql({ session })
    return { client, shop, session }
  },
  /**
   * 创建用于离线访问的 Shopify Storefront 客户端。
   * @async
   * @param params - 请求和响应对象。
   * @param shop - 店铺域名
   */
  storefrontClient: async ({ shop }: { shop: string }) => {
    const session = await fetchOfflineSession(shop)
    if (!session) {
      throw new Error('加载离线会话失败')
    }
    const client = new shopify.clients.Storefront({ session })
    return { client, shop, session }
  },
}

/** 获取与请求关联的在线会话 */
const fetchOnlineSession = async ({ req, res }: Handle) => {
  const sessionID = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  })
  const session = await sessionHandler.loadSession(sessionID as string)
  return session
}

/**
 * 提供创建在线访问客户端的方法。
 * @namespace online
 */
const online = {
  /** 创建用于在线访问的 Shopify GraphQL 客户端 */
  graphqlClient: async ({ req, res }: Handle) => {
    const session = await fetchOnlineSession({ req, res })
    if (!session) {
      throw new Error('加载在线会话失败')
    }
    const client = new shopify.clients.Graphql({ session })
    const { shop } = session
    return { client, shop, session }
  },
  /**
   * 创建用于在线访问的 Shopify Storefront 客户端。
   * @async
   * @param params - 请求和响应对象。
   * @param req - Next.js API 请求对象
   * @param res - Next.js API 响应对象
   */
  storefrontClient: async ({ req, res }: Handle) => {
    const session = await fetchOnlineSession({ req, res })
    if (!session) {
      throw new Error('加载在线会话失败')
    }
    const client = new shopify.clients.Storefront({ session })
    const { shop } = session
    return { client, shop, session }
  },
}

/**
 * 为在线和离线访问提供 GraphQL 客户端提供者。
 * @namespace clientProvider
 */
const clientProvider = {
  offline,
  online,
}

export default clientProvider
