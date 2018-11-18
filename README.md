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

## options


| Property | Type    | Default | Description                                             |
| -------- | ------- | ------- | ------------------------------------------------------- |
| debugger | Boolean | true    | 移除断点调试 `debugger;` 代码                           |
| alert    | Boolean | true    | 移除 `alert` 函数调用                                   |
| console  | Boolean | null    | 移除 `console` 函数调用                                 |
| debugFn  | String  | null    | 移除 指定的自定义调试代码函数（包括调试函数声明和调用） |
