/**
 * 中间件，用于向匹配的请求添加内容安全策略头。
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    /*
     * 例外情况:
     * /api/auth, /api/webhooks, /api/proxy_route, /api/gdpr, /_next,
     * /_proxy, /_auth, /_static, /_vercel, /public (/favicon.ico, 等)
     */
    '/((?!api/auth|api/webhooks|api/proxy_route|api/gdpr|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}

/**
 * @param request - 传入的请求对象。
 * @returns 带有修改后头的响应对象。
 */
export function proxy(request: NextRequest) {
  const {
    nextUrl: { search },
  } = request

  /**
   * 将查询字符串转换为对象。
   */
  const urlSearchParams = new URLSearchParams(search)
  const params = Object.fromEntries(urlSearchParams.entries())

  const shop = (params.shop as string) || '*.myshopify.com'

  /**
   * 构建 Next.js 响应并设置 Content-Security-Policy 头。
   */
  const res = NextResponse.next()
  res.headers.set(
    'Content-Security-Policy',
    `frame-ancestors https://${shop} https://admin.shopify.com;`,
  )
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
  res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  )

  return res
}
