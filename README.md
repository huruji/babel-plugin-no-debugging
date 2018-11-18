# babel-plugin-no-debugging
上线前去掉调试代码的Babel插件

## 安装

```js
npm install -D babel-plugin-no-debugging
```

## 使用

`.babelrc`
```js
{
  plugins: ["no-debugging"]
}
```

这个插件默认会移除 `debugger;` 和 `console` 调用。

这个插件可以移除 `debugger` 、 `console` 、 `alert` 和 自定义的调试函数调用和定义。自定义的debugger函数常常在不好调试的端环境中使用，如在可抓包环境下发起一个简单请求判断代码是否运行到某个位置

> 注意：据笔者了解 `alert` 函数调用仍然大量存在于各类管理后台系统中，开启时需要注意。

为保证在开发阶段不转换代码，记得将这个插件只配置在发布阶段：

`.babelrc`

```js
{
 {
  "env": {
    "publish": {
      "presets": [
        "@babel/preset-env"
      ],
      "plugins": ["no-debugging"]
    }
  }
}
```

在项目的 `package.json` 中配置好 `scripts` 会更加方便：

```
{
  "scripts": {
    "build": "cross-env BABEL_ENV=publish webpack",
  },
}
```

## options


| Property | Type    | Default | Description                                             |
| -------- | ------- | ------- | ------------------------------------------------------- |
| debugger | Boolean | true    | 移除断点调试 `debugger;` 代码                           |
| console  | Boolean | true    | 移除 `console` 函数调用                                 |
| alert    | Boolean | null    | 移除 `alert` 函数调用                                   |
| debugFn  | String  | null    | 移除 指定的自定义调试代码函数（包括调试函数声明和调用） |


## 例子

### 使用默认配置：

`.babelrc`

```js
{
  plugins: [
    [
      "no-debugging"
    ]
  ]
}
```

转换前：

```js
const a = 12;
const b = 13;

function add(m, n) {
  debugger;
  return m + n;
}

const result = add(a, b);

console.log(result);
```

转换后：

```js
const a = 12;
const b = 13;

function add(m, n) {
  return m + n;
}

const result = add(a, b);

```

### 自定义配置

移除 `alert` 和 自定义的 debugger 函数

`.babelrc`

```js
{
  plugins: [
    [
      "no-debugging",
      {
        alert: true,
        debugFn: "requestDebug",
        console: false
      }
    ]
  ]
}
```

转换前：

```js

const a = 12;
const b = 13;

function requestDebug(name) {
  const debugjs = 'https://example.com/debugger.js'
  request(`${debugjs}?name=${name}`).then(()=>{
    // your code
  })
}

function add(m, n) {
  debugger;
  return m + n;
}

alert(result);

const result = add(a, b);

console.log(result);

requestDebug(result);

```

转换后：

```js
const a = 12;
const b = 13;


function add(m, n) {
  return m + n;
}


const result = add(a, b);

console.log(result);

```