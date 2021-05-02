# [mp-mixin](https://www.github.com/theajack/mp-mixin)

<p>
    <a href="https://www.github.com/theajack/mp-mixin"><img src="https://img.shields.io/github/stars/theajack/mp-mixin.svg?style=social" alt="star"></a>
    <a href="https://theajack.gitee.io"><img src="https://img.shields.io/badge/author-theajack-blue.svg?style=social" alt="Author"></a>
</p> 

<p>
    <a href="https://www.npmjs.com/package/mp-mixin"><img src="https://img.shields.io/npm/v/mp-mixin.svg" alt="Version"></a>
    <a href="https://npmcharts.com/compare/mp-mixin?minimal=true"><img src="https://img.shields.io/npm/dm/mp-mixin.svg" alt="Downloads"></a>
    <a href="https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js"><img src="https://img.shields.io/bundlephobia/minzip/mp-mixin.svg" alt="Size"></a>
    <a href="https://github.com/theajack/mp-mixin/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/mp-mixin.svg" alt="License"></a>
    <a href="https://github.com/theajack/mp-mixin/search?l=typescript"><img src="https://img.shields.io/github/languages/top/theajack/mp-mixin.svg" alt="TopLang"></a>
    <a href="https://github.com/theajack/mp-mixin/issues"><img src="https://img.shields.io/github/issues-closed/theajack/mp-mixin.svg" alt="issue"></a>
    <a href="https://github.com/theajack/mp-mixin/blob/master/test/test-report.txt"><img src="https://img.shields.io/badge/test-passed-44BB44" alt="test"></a>
</p>

<h3>🚀 微信小程序 mixin 和 store 方案</h3>

**[English](https://github.com/theajack/mp-mixin/blob/master/README.md) | [更新日志](https://github.com/theajack/mp-mixin/blob/master/helper/version.md) | [反馈错误/缺漏](https://github.com/theajack/mp-mixin/issues/new) | [Gitee](https://gitee.com/theajack/mp-mixin)**

---

### 1. 特性

1. 支持 mixin data、methods、生命周期及Page事件
2. 支持不同Page 使用 store 共用状态
3. 支持全局 mixin 和 store
4. typescript编写
5. 支持QQ小程序 以及其他api和微信小程序相似的小程序

### 2. 快速使用

#### 2.1 npm 安装

```
npm i mp-mixin
```

```js
import 'mp-mixin';
```

#### 2.2 cdn

[点击下载](https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js) cdn 文件，复制到您的小程序项目中，然后 import 这个文件就可以

cdn地址: [https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js](https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js)

#### 2.3 快速使用

全局mixin, 推荐在 app.js 中引入

```js
import 'mp-mixin';
wx.mixin({
    data: {}, // 可选
    methods: {}, // 可选
    store: wx.createStore({}), // 可选 也可以是 {}
    // 以下为Page生命周期或事件
    onLoad(){

    },
    onShareAppMessage(){

    }
})
```

Page mixin 

```js
Page({
    mixin: {
        data: {}, // 可选
        methods: {}, // 可选
        store: wx.createStore({}), // 可选 只能是 store对象 不能是json
        // 以下为Page生命周期或事件
        onLoad(){

        },
        onShareAppMessage(){

        }
    }
    // ...
})
```

* 如有相同的键值对，优先级为 组件 > 局部mixin > 全局mixin
* data 优先级 高于 store

### 3 api

引入 mp-mixin 之后，mp-mixin 会将一下三个 api 挂载到 wx 对象上

```js
wx.mixin
wx.createStore
wx.initGlobalStore
```

您也可以主动引入来使用上述三个API

```js
import {globalMixin, createStore, initGlobalStore} from 'mp-mixin'
// ...
```


您可以通过 `injectStaff` 方法手动注入到任何对象上

```js
import {injectStaff} from 'mp-mixin'
injectStaff(anyObject);
```

#### 3.1 mixin 对象

mixin对象是一个 json，数据结构如下

```js
const mixin = {
    data: {}, // 可选
    methods: {}, // 可选
    store: wx.creteStore({}), // 可选 当全局注入时，store可以是一个json， 否则 必须是 store对象
    // 以下为Page生命周期或事件
    onLoad(){

    },
    onShareAppMessage(){

    }
}
```

#### 3.2 globalMixin

该api等价于 wx.mixin

作用是注入全局 mixin，全局mixin在每个页面中都生效

```js
wx.mixin(mixin); // mixin 见 3.1
```

#### 3.1 globalMixin

该api等价于 wx.mixin

作用是注入全局 mixin，全局mixin在每个页面中都生效

```js
wx.mixin(mixin); // mixin 见 3.1
```