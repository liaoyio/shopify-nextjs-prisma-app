import shopify from '@/utils/shopify'
import validateJWT from '../validate-jwt'
import type { Middleware } from 'next-api-middleware'

/**
 * @async
 * @function verifyCheckout
 * @param req - Next.js API 请求对象，期望包含 'authorization' 头。
 * @param res - Next.js API 响应对象，用于在需要时返回错误消息。
 * @param next - 回调函数，用于将控制权传递给 Next.js API 路由中的下一个中间件函数。
 * @throws 如果授权头缺失或无效，或者载荷中未找到店铺，将抛出错误。
 */
const verifyCheckout: Middleware = async (req, res, next) => {
  // 在收到 GET/POST 请求之前，您首先会收到一个 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new Error('未找到授权头。')
    }

    const payload = validateJWT(authHeader.split(' ')[1])

    const shop = shopify.utils.sanitizeShop(
      (payload.dest as string).replace('https://', ''),
    )
    if (!shop) {
      throw new Error('未找到店铺，不是有效请求')
    }

    req.user_shop = shop

    await next()
  } catch (e) {
    const error = e as Error
    console.error(`---> verifyCheckout 中间件发生错误: ${error.message}`)
    return res.status(401).send({ error: '未授权的调用' })
  }
}

export default verifyCheckout
