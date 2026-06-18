# prettier-plugin-verticalize

这是一个 Prettier v3+ 插件，用于对代码中的变量声明、枚举属性、赋值表达式等进行**垂直对齐**。

目前支持的对齐：

- 变量声明
- 枚举值
- 赋值表达式
- 行尾注释

> ⚠️ 本插件依赖等宽字体才能正确显示对齐效果。请确保编辑器使用的是等宽（monospace）字体，例如 Fira Code, JetBrains Mono,
> Consolas, Monaco 等。

## 效果预览

![效果预览](doc/images/compare.png)

## 安装

```bash
npm install -D prettier prettier-plugin-verticalize
```

需要 Prettier 3.x。

## 启用

在 Prettier 配置文件中注册插件。本插件基于 estree printer，需与 Prettier 自带的 parser 插件一起使用：

ESM 写法：

```js
// prettier.config.js
import prettierPluginVerticalize from 'prettier-plugin-verticalize'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginTypescript from 'prettier/plugins/typescript'

export default {
  plugins: [
    prettierPluginEstree,
    prettierPluginTypescript,
    prettierPluginBabel,
    prettierPluginVerticalize,
  ],
}
```

CommonJS 写法：

```js
// prettier.config.cjs
module.exports = {
  plugins: [
    require('prettier/plugins/estree'),
    require('prettier/plugins/typescript'),
    require('prettier/plugins/babel'),
    require('prettier-plugin-verticalize'),
  ],
}
```

在 `.prettierrc` 中：

```json
{
  "plugins": [
    "prettier/plugins/estree",
    "prettier/plugins/typescript",
    "prettier/plugins/babel",
    "prettier-plugin-verticalize"
  ]
}
```

## 配置选项

| 选项                                   | 类型      | 默认值 | 说明                          |
| -------------------------------------- | --------- | ------ | ----------------------------- |
| `minGroupSize`                         | `number`  | `2`    | 最少几条语句视为一组进行对齐  |
| `maxWidthDiff`                         | `number`  | `20`   | 组内语句之间最大宽度差异      |
| `alignTrailingComments`                | `boolean` | `true` | 是否启用行尾注释对齐          |
| `alignEnums`                           | `boolean` | `true` | 是否启用枚举对齐              |
| `alignVariableDeclaration`             | `boolean` | `true` | 是否启用变量声明对齐          |
| `alignAssignment`                      | `boolean` | `true` | 是否启用赋值语句对齐          |
| `alignTrailingCommentsMinGroupSize`    | `number`  | -      | 单独设置行尾注释 minGroupSize |
| `alignTrailingCommentsMaxWidthDiff`    | `number`  | -      | 单独设置行尾注释 maxWidthDiff |
| `alignEnumsMinGroupSize`               | `number`  | -      | 单独设置枚举 minGroupSize     |
| `alignEnumsMaxWidthDiff`               | `number`  | -      | 单独设置枚举 maxWidthDiff     |
| `alignVariableDeclarationMinGroupSize` | `number`  | -      | 单独设置变量声明 minGroupSize |
| `alignVariableDeclarationMaxWidthDiff` | `number`  | -      | 单独设置变量声明 maxWidthDiff |
| `alignAssignmentMinGroupSize`          | `number`  | -      | 单独设置赋值语句 minGroupSize |
| `alignAssignmentMaxWidthDiff`          | `number`  | -      | 单独设置赋值语句 maxWidthDiff |

### minGroupSize

```javascript
// 当 `minGroupSize` 设置为 3 时，少于 3 行，不对齐
const name = 'rio'
const age = 18

// 当 `minGroupSize` 设置为 3 时，大于等于 3 行，对齐
const foo       = 1
const barz      = 2
const component = 3
```

### maxWidthDiff

```javascript
// 当 `maxWidthDiff` 设置为 20 时
const name        = 1      // name
const array       = [1, 2] // list
const array123456 = 3      // name
const array654321 = [3, 4] // list

// 当 `maxWidthDiff` 设置为 5 时
const name  = 1      // name
const array = [1, 2] // list
const array123456 = 3      // name
const array654321 = [3, 4] // list
```
