import withMiddleware from '@/server/middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * 获取当前登录用户的详细信息
 *
 * 从 tokenExchange 返回的 session 对象的 onlineAccessInfo.associated_user 字段获取用户信息
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: '仅支持 GET 请求' })
  }

  try {
    const session = req.user_session
    if (!session) {
      return res.status(401).send({ error: '未找到会话信息' })
    }

    // tokenExchange 返回的 session 对象包含 onlineAccessInfo.associated_user 字段
    const user = session.onlineAccessInfo?.associated_user

    return res.status(200).send({
      user: user
        ? {
            id: user.id,
            email: user.email,
            accountOwner: user.account_owner,
            locale: user.locale,
            firstName: user.first_name,
            lastName: user.last_name,
            emailVerified: user.email_verified,
            collaborator: user.collaborator,
          }
        : null,
      session: {
        shop: session.shop,
        isOnline: session.isOnline,
        scope: session.scope,
        expires: session.expires,
      },
    })
  } catch (e) {
    const error = e as Error
    console.error(`---> 获取用户信息时发生错误: ${error.message}`, e)
    return res.status(500).send({ error: error.message })
  }
}

export default withMiddleware('verifyRequest')(handler)
