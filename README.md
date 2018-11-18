# babel-plugin-no-dubugging
上线时去掉调试代码的Babel插件

## 安装

```js
npm install -D babel-plugin-no-debugging
```

## 使用

`.babelrc`
```js
{
  plugins: ['no-debugging']
}
```

这个插件默认会移除 `debugger;` 和 `console` 调用。

这个插件可以移除 `debugger` 、 `console` 、 `alert` 和 自定义的调试函数调用和定义。

> 注意：据笔者了解 `alert` 函数调用仍然大量存在于各类管理后台系统中，开启时需要注意。

## options


| Property | Type    | Default | Description                                             |
| -------- | ------- | ------- | ------------------------------------------------------- |
| debugger | Boolean | true    | 移除断点调试 `debugger;` 代码                           |
| console  | Boolean | true    | 移除 `console` 函数调用                                 |
| alert    | Boolean | null    | 移除 `alert` 函数调用                                   |
| debugFn  | String  | null    | 移除 指定的自定义调试代码函数（包括调试函数声明和调用） |
