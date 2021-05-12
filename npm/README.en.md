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

<h3>🚀 WeChat Mini Program mixin and store solution</h3>

**[中文](https://github.com/theajack/mp-mixin/blob/master/README.md) | [Update Log](https://github.com/theajack/mp-mixin/blob/master/helper/version.md) | [Feedback bug/missing](https://github.com/theajack/mp-mixin/issues/new) | [Gitee](https://gitee.com/theajack/mp-mixin)**

---

## 1. Features

1. Support mixin data, methods, life cycle and Page events
2. Support different Pages and Components to use store sharing status
3. Support global mixin and store
4. Typescript writing
5. Support QQ applet and other applets with similar api and WeChat applet
6. Small size, only 1.83kb

### 2. Quick use

#### 2.1 npm installation

```
npm i mp-mixin
```

```js
import'mp-mixin';
```

### 2.2 cdn

[Click to download](https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js) cdn file, copy it to your mini program project, and then import this file.

cdn address: [https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js](https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min .js)

### 2.3 Quick use

#### 2.3.1 mixin object

Mixin is an object, the data structure is as follows

```js
const store = wx.creteStore({});

const mixin = {
     data: {}, // optional
     methods: {}, // optional
     store: store, // optional When injecting globally, store can be a json, otherwise it must be a store object
     // The following is the unique life cycle or event of Page
     // Please refer to the applet documentation for details
     onLoad(){

     },
     onShareAppMessage(){

     },

     // The following is the unique life cycle or event of Component
     lifetimes:{
         // Please refer to the applet documentation for details
     },
     pageLifetimes:{
         // Please refer to the applet documentation for details
     }
}
```

[WeChat Mini Program Page Document](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)

[WeChat Mini Program Component Document](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)

#### 2.3.2 Global mixin

Global mixin, recommended to be introduced in app.js

```js
import'mp-mixin';
wx.mixin(mixin); // mixin object see 2.3.1
```

#### 2.3.3 Page mixin
 
You can also introduce mixin as needed in the Page structure

```js
Page({
    mixin: mixin, // mixin object see 2.3.1
    // ...
})
```

#### 2.3.4 Component mixin
 
You can also introduce mixin as needed in the Component structure

```js
Component({
    mixin: mixin, // mixin object see 2.3.1
    // ...
})
```

Description

* If there are the same key-value pairs, the priority is component> local mixin> global mixin
* data priority is higher than store
* The data in the mixin will be deep cloned and injected into the data in the corresponding Page, and the use of setData will not affect each other
* The store in the mixin will also be injected into the data in the Page. The difference is that if different pages introduce the same one, the setData of one page will affect the state of other pages, and the UI will be updated

### 3 api

After the introduction of mp-mixin, mp-mixin will mount the following three apis to the wx object

```js
wx.mixin
wx.createStore
wx.initGlobalStore
```

`wx.initGlobalStore` is equivalent to adding the store attribute to the `wx.mixin` method

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

You can also actively introduce to use the above three APIs

```js
import {globalMixin, createStore, initGlobalStore} from'mp-mixin'
// ...
```


You can manually inject into any object through the `injectStaff` method

```js
import {injectStaff} from'mp-mixin'
injectStaff(anyObject);
```

Get mp-mixin version

```js
wx.mpMixinVersion

// or

import {version} from 'mp-mixin';
```

### 4. Type declaration

1. [type.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/type.d.ts)
2. [index.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/index.d.ts)
