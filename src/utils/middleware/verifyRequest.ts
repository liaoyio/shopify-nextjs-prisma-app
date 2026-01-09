import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import { RequestedTokenType, Session } from "@shopify/shopify-api";
import validateJWT from "../validateJWT";
import type { NextApiRequest, NextApiResponse } from "next";

declare module "next" {
  interface NextApiRequest {
    user_session?: Session;
    user_shop?: string;
  }
}

/**
 * @async
 * @function verifyRequest
 * @param req - Next.js API 请求对象，期望包含 'authorization' 头。
 * @param res - Next.js API 响应对象，用于在需要时返回错误消息。
 * @param next - 回调函数，用于将控制权传递给 Next.js API 路由中的下一个中间件函数。
 * @throws 如果授权头缺失或无效，或者载荷中未找到店铺，将抛出错误。
 */
const verifyRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void | Promise<void>,
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw Error("未找到授权头。");
    }

    const payload = validateJWT(authHeader.split(" ")[1]);

    let shop = shopify.utils.sanitizeShop(
      (payload.dest as string).replace("https://", ""),
    );
    if (!shop) {
      throw Error("未找到店铺，不是有效请求");
    }

    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    let session = await sessionHandler.loadSession(sessionId as string);
    if (!session) {
      session = await getSession({ shop, authHeader });
    }

    if (
      session &&
      session?.expires &&
      new Date(session.expires) > new Date() &&
      shopify.config?.scopes &&
      shopify.config.scopes.equals(session?.scope)
    ) {
      // 会话有效
    } else {
      session = await getSession({ shop, authHeader });
    }

    if (!session) {
      throw Error("获取会话失败");
    }

    //将会话和店铺添加到请求对象中，以便使用此中间件的后续路由可以访问它
    req.user_session = session;
    req.user_shop = session.shop;

    await next();

    return;
  } catch (e) {
    const error = e as Error;
    console.error(`---> verifyRequest 中间件发生错误: ${error.message}`);
    return res.status(401).send({ error: "未授权的调用" });
  }
};

export default verifyRequest;

/**
 * 根据提供的认证头和离线标志检索并存储会话信息。
 *
 * @async
 * @function getSession
 * @param params - 函数参数。
 * @param shop - 请求店铺的 xxx.myshopify.com 网址。
 * @param authHeader - 包含会话令牌的授权头。
 * @returns 在线会话对象
 */

async function getSession({
  shop,
  authHeader,
}: {
  shop: string;
  authHeader: string;
}): Promise<Session | undefined> {
  try {
    const sessionToken = authHeader.split(" ")[1];

    const { session: onlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    await sessionHandler.storeSession(onlineSession);

    const { session: offlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });

    await sessionHandler.storeSession(offlineSession);

    return new Session(onlineSession);
  } catch (e) {
    const error = e as Error;
    console.error(`---> 从 Shopify 拉取会话时发生错误: ${error.message}`);
    return undefined;
  }
}
