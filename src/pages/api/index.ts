import withMiddleware from "@/utils/middleware/withMiddleware";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @param req - HTTP 请求对象。
 * @param res - HTTP 响应对象。
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    //GET, POST, PUT, DELETE
    console.log("仅在请求方法为 GET 时提供此服务");
    return res.status(405).send({ error: true });
  }

  try {
    return res.status(200).send({ text: "这是一个示例路由" });
  } catch (e) {
    console.error(e);
    return res.status(403).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);
