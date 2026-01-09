/**
 * 请勿删除将店铺 upsert 为 `true` 的 Prisma 查询。
 */
import prisma from "./prisma";

/**
 * @async
 * @function freshInstall
 * @param params - 函数参数容器。
 * @param shop - 店铺 URL，格式为 '*.myshopify.com'。
 */
const freshInstall = async ({ shop }: { shop: string }): Promise<void> => {
  try {
    console.log("这是一个全新安装，正在运行引导函数");

    await prisma.stores.upsert({
      where: {
        shop: shop,
      },
      update: {
        shop: shop,
        isActive: true,
      },
      create: {
        shop: shop,
        isActive: true,
      },
    });

    //其他函数从这里开始
  } catch (e) {
    const error = e as Error;
    console.error(`---> freshInstall 函数中发生错误: ${error.message}`, e);
  }
};

export default freshInstall;
