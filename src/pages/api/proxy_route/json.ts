import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @param req - HTTP 请求对象。
 * @param res - HTTP 响应对象。
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.user_shop) {
      return res.status(400).send({ error: "未找到店铺" });
    }

    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop, //代理路由中 req.user_session 不可用
    });

    return res.status(200).send({ content: "代理正在工作" });
  } catch (e) {
    const error = e as Error;
    console.error(`---> /api/proxy_route/json 发生错误: ${error.message}`, e);
    return res.status(400).send({ error: true });
  }
};

export default withMiddleware("verifyProxy")(handler);
