import crypto from 'crypto'

/**
 * 根据密钥验证 JWT 令牌。
 *
 * @param token - JWT 令牌
 * @param secret - 签名密钥。默认使用 `process.env.SHOPIFY_API_SECRET` 的值
 * @returns 解码后的 JWT 载荷。
 */
export function validateJWT(
  token: string,
  secret: string | undefined = process.env.SHOPIFY_API_SECRET,
): Record<string, any> {
  if (!secret) {
    throw new Error('JWT: 密钥未定义')
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('JWT: 令牌结构不正确')
  }

  const header = parts[0]
  const payload = parts[1]
  const signature = parts[2]

  const payloadJson = Buffer.from(payload, 'base64').toString()

  // 验证签名
  const signatureCheck = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64')

  const safeSignatureCheck = signatureCheck
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  if (safeSignatureCheck !== signature) {
    throw new Error('无效的令牌签名')
  }

  return JSON.parse(payloadJson)
}
