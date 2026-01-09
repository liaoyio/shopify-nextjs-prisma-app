const setupCheck = (): void => {
  try {
    const {
      SHOPIFY_API_KEY: apiKey,
      SHOPIFY_API_SECRET: apiSecret,
      SHOPIFY_API_SCOPES: apiScopes,
      SHOPIFY_APP_URL: appUrl,
      SHOPIFY_API_VERSION: apiVersion,
      ENCRYPTION_STRING: encString,
      DATABASE_URL: databaseURL,
      APP_NAME: appName,
      APP_HANDLE: appHandle,
      APP_PROXY_PREFIX: proxyPrefix,
      APP_PROXY_SUBPATH: proxySubpath,
    } = process.env;

    if (typeof apiKey === "undefined") {
      throw Error("❌ API 密钥未定义。");
    }
    if (typeof apiSecret === "undefined") {
      throw Error("❌ API 密钥未定义。");
    }
    if (typeof apiScopes === "undefined") {
      throw Error("❌ API 权限范围未定义。");
    }
    if (typeof appUrl === "undefined") {
      throw Error("❌ 应用 URL 未定义。");
    } else if (!appUrl.includes("https://")) {
      console.error("⚠️ 请为 SHOPIFY_APP_URL 使用 HTTPS。");
    }
    if (typeof apiVersion === "undefined") {
      throw Error("❌ API 版本未定义。");
    }
    if (typeof encString === "undefined") {
      throw Error("❌ 加密字符串未定义。");
    }

    if (typeof databaseURL === "undefined") {
      throw Error("❌ 数据库连接字符串未定义。");
    }

    if (typeof appName === "undefined" || appName.length < 1) {
      throw Error(
        `❌ 应用名称${typeof appName !== "undefined" && appName.length < 1 ? "未正确填写" : "未定义"}。`,
      );
    }
    if (typeof appHandle === "undefined") {
      throw Error("❌ 应用句柄未定义。");
    }
    if (appHandle.includes(" ")) {
      throw Error("❌ 句柄必须进行 URL 编码且不能包含空格。");
    }

    if (typeof proxySubpath === "undefined") {
      console.warn(
        "⚠️ 应用代理子路径未定义，将不会被使用。请确保您的应用不使用应用代理",
      );
    } else {
      if (typeof proxyPrefix === "undefined") {
        throw Error("❌ 应用代理前缀未定义");
      }
      switch (proxyPrefix) {
        case "apps":
        case "a":
        case "community":
        case "tools":
          break;
        default:
          throw Error(
            "❌ 无效的应用代理前缀，请确保值为以下之一：\napps\na\ncommunity\ntools",
          );
      }
    }

    console.log("✅ 设置检查通过！");
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
  }
};

export default setupCheck;
