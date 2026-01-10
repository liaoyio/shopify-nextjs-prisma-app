import { RequestedTokenType } from '@shopify/shopify-api'
import sessionHandler from '../session-handler'
import shopify from '../shopify'
import freshInstall from '../fresh-install'
import prisma from '../prisma'
import type { GetServerSidePropsContext } from 'next'

/**
 * @async
 * @param context - Next.js getServerSideProps 上下文
 * @returns 要传递给页面组件的 props 对象。
 */
const isInitialLoad = async (
  context: GetServerSidePropsContext,
): Promise<{ props: { [key: string]: any } }> => {
  try {
    const shop = context.query.shop as string | undefined
    const idToken = context.query.id_token as string | undefined

    // 初始加载
    if (idToken && shop) {
      const { session: offlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      })

      const { session: onlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OnlineAccessToken,
      })

      await sessionHandler.storeSession(offlineSession)
      await sessionHandler.storeSession(onlineSession)

      const isFreshInstall = await prisma.stores.findFirst({
        where: {
          shop: onlineSession.shop,
        },
      })

      if (!isFreshInstall || isFreshInstall?.isActive === false) {
        // !isFreshInstall -> 新安装
        // isFreshInstall?.isActive === false -> 重新安装
        await freshInstall({ shop: onlineSession.shop })
      }
    } else {
      // 用户再次访问了页面。
      // 我们知道这一点是因为我们没有保留任何 URL 参数，并且这里不存在 idToken
    }
    return {
      props: {
        data: 'ok',
      },
    }
  } catch (e) {
    const error = e as Error
    if (
      error.message.includes('Failed to parse session token')
      && process.env.NODE_ENV === 'development'
    ) {
      console.warn(
        'JWT 错误 - 在开发模式下会发生，可以安全地忽略，但在生产环境中不能忽略。',
      )
    } else {
      console.error(`---> isInitialLoad 发生错误: ${error.message}`, e)
      return {
        props: {
          serverError: true,
        },
      }
    }
    return {
      props: {
        data: 'ok',
      },
    }
  }
}

export default isInitialLoad
