import crypto from 'crypto'
import shopify from '@/server/shopify/config'
import type { Middleware } from 'next-api-middleware'

const verifyHmac: Middleware = async (req, res, next) => {
  try {
    const generateHash = crypto
      .createHmac('SHA256', process.env.SHOPIFY_API_SECRET || '')
      .update(JSON.stringify(req.body), 'utf8')
      .digest('base64')

    const hmac = req.headers['x-shopify-hmac-sha256'] as string | undefined

    if (hmac && shopify.auth.safeCompare(generateHash, hmac)) {
      await next()
    } else {
      return res.status(401).send({ success: false, message: 'HMAC 验证失败' })
    }
  } catch (e) {
    const error = e as Error
    console.log(`---> 验证 HMAC 时发生错误`, error.message)
    return res.status(401).send({ success: false, message: 'HMAC 验证失败' })
  }
}

export default verifyHmac
