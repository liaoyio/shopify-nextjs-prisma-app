import crypto from 'crypto'
import { NextResponse } from 'next/server'
import shopify from '@/utils/shopify'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - 传入的请求对象。
 * @param res - 响应对象。
 * @param next - 回调函数，用于将控制权传递给 Next.js API 路由中的下一个中间件函数。
 */
const verifyHmac = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void | Promise<void>,
): Promise<void | NextResponse> => {
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
    return new NextResponse(
      JSON.stringify({ success: false, message: 'HMAC verification failed' }),
      {
        status: 401,
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  }
}

export default verifyHmac
