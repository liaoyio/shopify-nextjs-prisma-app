import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

declare module "next" {
  interface NextApiRequest {
    user_shop?: string;
  }
}

/**
 * @param req - 传入的请求对象。
 * @param res - 响应对象。
 * @param next - 回调函数，用于将控制权传递给 Next.js API 路由中的下一个中间件函数。
 */
const verifyProxy = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void | Promise<void>,
): Promise<void> => {
  const { signature } = req.query as { signature: string };

  const queryURI = encodeQueryData(req.query as Record<string, string>)
    .replace("/?", "")
    .replace(/&signature=[^&]*/, "")
    .split("&")
    .map((x) => decodeURIComponent(x))
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET || "")
    .update(queryURI, "utf-8")
    .digest("hex");

  if (calculatedSignature === signature) {
    req.user_shop = req.query.shop as string; //myshopify 域名
    await next();
  } else {
    return res.status(401).send({
      success: false,
      message: "签名验证失败",
    });
  }
};

/**
 * 将提供的数据编码为 URL 查询字符串格式。
 *
 * @param data - 要编码的数据。
 * @returns 编码后的查询字符串。
 */
function encodeQueryData(data: Record<string, string>): string {
  const queryString: string[] = [];
  for (const d in data) {
    queryString.push(d + "=" + encodeURIComponent(data[d]));
  }
  return queryString.join("&");
}

export default verifyProxy;
