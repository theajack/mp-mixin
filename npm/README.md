# [mp-mixin](https://www.github.com/theajack/mp-mixin)

<p>
    <a href="https://www.github.com/theajack/mp-mixin/stargazers" target="_black">
        <img src="https://img.shields.io/github/stars/theajack/mp-mixin?logo=github" alt="stars" />
    </a>
    <a href="https://www.github.com/theajack/mp-mixin/network/members" target="_black">
        <img src="https://img.shields.io/github/forks/theajack/mp-mixin?logo=github" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/mp-mixin" target="_black">
        <img src="https://img.shields.io/npm/v/mp-mixin?logo=npm" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/mp-mixin" target="_black">
        <img src="https://img.shields.io/npm/dm/mp-mixin?color=%23ffca28&logo=npm" alt="downloads" />
    </a>
    <a href="https://github.com/theajack/mp-mixin/issues"><img src="https://img.shields.io/github/issues-closed/theajack/mp-mixin.svg" alt="issue"></a>
</p>
<p>
    <a href="https://github.com/theajack" target="_black">
        <img src="https://img.shields.io/badge/Author-%20theajack%20-7289da.svg?&logo=github" alt="author" />
    </a>
    <a href="https://www.github.com/theajack/mp-mixin/blob/master/LICENSE" target="_black">
        <img src="https://img.shields.io/github/license/theajack/mp-mixin?color=%232DCE89&logo=github" alt="license" />
    </a>
    <a href="https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js"><img src="https://img.shields.io/bundlephobia/minzip/mp-mixin.svg" alt="Size"></a>
    <a href="https://github.com/theajack/mp-mixin/search?l=javascript"><img src="https://img.shields.io/github/languages/top/theajack/mp-mixin.svg" alt="TopLang"></a>
    <a href="https://www.github.com/theajack/mp-mixin"><img src="https://img.shields.io/librariesio/dependent-repos/npm/mp-mixin.svg" alt="Dependent"></a>
    <a href="https://github.com/theajack/mp-mixin/blob/master/test/test-report.txt"><img src="https://img.shields.io/badge/test-passed-44BB44" alt="test"></a>
</p>

<h3>🚀 微信小程序 mixin 和 store 方案</h3>

**[English](https://github.com/theajack/mp-mixin/blob/master/README.en.md) | [更新日志](https://github.com/theajack/mp-mixin/blob/master/helper/version.md) | [反馈错误/缺漏](https://github.com/theajack/mp-mixin/issues/new) | [Gitee](https://gitee.com/theajack/mp-mixin)**

---

## 1. 特性

1. 支持 mixin data、methods、生命周期及Page事件
2. 支持不同Page 使用 store 共用状态
3. 支持全局 mixin 和 store
4. typescript编写
5. 支持QQ小程序 以及其他api和微信小程序相似的小程序
6. 体积小巧，仅 1.83kb

### 2. 快速使用

#### 2.1 npm 安装

```
npm i mp-mixin
```

```js
import 'mp-mixin';
```

### 2.2 cdn

[点击下载](https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js) cdn 文件，复制到您的小程序项目中，然后 import 这个文件就可以

cdn地址: [https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js](https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js)

### 2.3 快速使用

#### 2.3.1 mixin 对象

mixin 是一个对象，数据结构如下

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

#### 2.3.2 全局mixin

全局mixin, 推荐在 app.js 中引入

```js
import 'mp-mixin';
wx.mixin(mixin); // mixin 对象 见 2.3.1
```

#### 2.3.3 Page mixin
 
也可以在Page构造中按需引入 mixin

```js
Page({
    mixin: mixin, // mixin 对象 见 2.3.1
    // ...
})
```

说明

* 如有相同的键值对，优先级为 组件 > 局部mixin > 全局mixin
* data 优先级 高于 store
* mixin 中的 data 会被深克隆分别注入对应的Page中的data，使用setData互不影响
* mixin 中的 store也会被注入Page中的data，区别是如果不同Page引入的是同一个，则一个页面setData会影响其他页面的 状态，且UI会更新

### 3 api

引入 mp-mixin 之后，mp-mixin 会将一下三个 api 挂载到 wx 对象上

```js
wx.mixin
wx.createStore
wx.initGlobalStore
```

`wx.initGlobalStore` 等价于在 `wx.mixin` 方法中加入 store属性

```js
wx.initGlobalStore({
    // state
})

wx.mixin({
    store: {
        // state
    }
})
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

获取 mp-mixin version

```js
wx.mpMixinVersion

// 或者

import {version} from 'mp-mixin';
```

### 4. 类型声明

1. [type.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/type.d.ts)
2. [index.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/mp-mixin.min.d.ts)