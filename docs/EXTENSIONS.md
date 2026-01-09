# 扩展

设置扩展需要重新调整文件夹结构。

- 创建一个名为 `app/` 的新文件夹，其中包含除 `docs/` 和 `.git/` 文件夹之外的所有内容。
  - 您可能需要在系统中启用查看隐藏文件。
    - macOS: Command + Shift + .
    - Linux: Control + H
    - Windows: https://kinsta.com/blog/show-hidden-files

- 在根目录创建一个名为 `extension/` 的新文件夹。
  - 确保 `app/` 和 `extension/` 在同一级别。

- 通过在根目录和 `extension/` 中使用 `npm init --y` 或手动创建名为 `package.json` 的新文件来创建新的 `package.json` 文件。

- 进入 `app/package.json` 并将 `update:config` 脚本更新为 `node _developer/tomlWriter.js && cd .. && shopify app deploy`
  - 我已经测试过它可以在 `bun` 上工作，`npm` 或其他包管理器可能会导致问题。如果 CLI 无法检测到您的扩展，您可以切换到 `bun` 或将 `update:config` 脚本更改为仅 `node _developer/tomlWriter.js` 并从根目录运行 `shopify app deploy`。
  - 有关此的更多信息[可在此处找到](https://github.com/kinngh/shopify-nextjs-prisma-app/discussions/53)

- 现在在您的 `extension/package.json` 中，最好有这个脚本，这样更容易创建新扩展，这将把您的扩展放在 `extension/extensions/extension-name` 中：

```javascript
"generate": "shopify app generate extension"
```

## 笔记

为了视觉参考，这是我们期望的文件夹结构的样子：

简化版:

![Screenshot 2024-03-09 at 12 23 17 PM](https://github.com/kinngh/shopify-nextjs-prisma-app/assets/773555/462479bd-360f-49cb-aed7-b8b1c85ab5a1)

详细版:

![Screenshot 2024-03-09 at 12 23 11 PM](https://github.com/kinngh/shopify-nextjs-prisma-app/assets/773555/2af3463f-fe9f-4c88-841c-9f15bbf72474)

更新脚本后的 `npm` 与 `bun` 的区别:
![npm v bun](https://github.com/kinngh/shopify-nextjs-prisma-app/assets/773555/8781d757-92b3-4f26-9aff-79b200920365)
