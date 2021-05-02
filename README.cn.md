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

局部mixin会覆盖全局mixin 

### 3 api


引入 mp-mixin 之后，mp-mixin 会将一下三个 api 挂载到 wx 对象上

```js
wx.mixin
wx.createStore
wx.initGlobalStore
```

您可以通过 `injectStaff` 方法手动注入到任何对象上

```js
import {injectStaff} from 'mp-mixin'
injectStaff(anyObject);
```

```js
import {injectStaff} from 'mp-mixin'
injectStaff(anyObject);
```


详情请参考 [index.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/index.d.ts)

```ts
interface IEventStatic {
    version: string;
    EVENT: IJson<string>; // 事件枚举
    emit(name: TEventName, data?: any): boolean; // 触发事件
    onEmit(fn: IOnInterceptorEmit): void;
    regist(name: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: TEventName): ILink;
    regist(name: IJson<IEventRegistOption>): IJson<IEventItem>;
    regist(name: IRegistObject): IEventItem;
    onRegist(fn: IOnInterceptorRegist): void;
    checkEvent(name: TEventName): boolean; // 检查是否存在事件
    remove(name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
    remove(eventItem: IEventItem, imme?: boolean): boolean;
    clear(name?: TEventName | TEventName[]): void;
    order(name: TEventName): number;
    registNotImmediate(name: TEventName, listener: IEventListener): IEventItem;
    registNotImmediateOnce(name: TEventName, listener: IEventListener): IEventItem;
    registOnce(name: TEventName, listener: IEventListener): IEventItem;
    registSingle(name: TEventName, listener: IEventListener): IEventItem;
}
```

### 4 使用实例

#### 4.1 checkEvent

判断事件是否存在

```js
const eventName = 'test-checkEvent';
const result = [];
result.push(event.checkEvent(eventName));
event.regist(eventName, () => {});
result.push(event.checkEvent(eventName));
event.emit(eventName);
result.push(event.checkEvent(eventName));
event.clear(eventName);
result.push(event.checkEvent(eventName));
event.regist(eventName, () => {});
result.push(event.checkEvent(eventName));
event.clear();
result.push(event.checkEvent(eventName));
console.log(result);
// [false, true, true, false, true, false]
```

#### 4.2 clear 方法

清除单个或所有事件

```js
const eventName = 'test-clear';
const result = [];
event.regist(eventName, () => {
    result.push(1);
});
event.emit(eventName);
event.clear(eventName);
event.emit(eventName);
event.regist(eventName, {
    immediate: false,
    listener: () => {
        result.push(2);
    }
});
event.emit(eventName);
event.clear();
event.emit(eventName);
console.log(result);
// [1, 2]
```

#### 4.3 immediate 参数

immediate 参数表示注册事件时，如果该事件已经被触发过，是否需要立即触发当前的事件

默认值为 true

```js
const eventName = 'test-immediate';
const result = [];
event.emit(eventName);

event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, {
    immediate: true,
    listener () { result.push(2);}
});
event.regist(eventName, {
    immediate: false,
    listener () {result.push(3);}
});
console.log(result);
// [1, 2]
```

#### 4.4 index 参数

index 参数表示注册事件时，希望插入的位置

```js
const eventName = 'test-order';
    
const result = [];
event.regist(eventName, () => {
    result.push(1); // 1
});
event.regist(eventName, () => {
    result.push(2); // 1 2
});
event.regist(eventName, () => {
    result.push(3); // 1 2 3
});
event.regist(eventName, () => {
    result.push(4); // 1 2 3 4
});
event.regist(eventName, {
    index: 0,  // 5 1 2 3 4
    listener () {result.push(5);}
});
event.regist(eventName, {
    index: 2, // 5 1 6 2 3 4
    listener () {result.push(6);}
});
event.regist(eventName, {
    index: 1, // 5 7 1 6 2 3 4
    listener () {result.push(7);}
});
event.regist(eventName, {
    index: 100, // 5 7 1 6 2 3 4 8
    listener () {result.push(8);}
});
event.regist(eventName, {
    index: -3, // 9 5 7 1 6 2 3 4 8
    listener () {result.push(9);}
});
event.emit(eventName);
console.log(result);
// [9, 5, 7, 1, 6, 2, 3, 4, 8]
```

#### 4.5 interceptor

全局拦截器，支持 onRegist 和 onEmit

```js
const eventName1 = 'test-interceptor1';
const eventName2 = 'test-interceptor2';
const result = [];
event.onRegist(({name, item}) => {
    result.push(`onRegist: ${name}`);
});
event.onEmit(({name, item, data, firstEmit}) => {
    result.push(`onEmit: ${name} ${data} ${firstEmit}`);
});
event.regist(eventName1, () => {});
event.regist(eventName2, () => {});
event.emit(eventName1, `${eventName1} data`);
event.emit(eventName2, `${eventName2} data`);
event.emit(eventName2, `${eventName2} data2`);
console.log(result);
/*
    [
        'onRegist: test-interceptor1',
        'onRegist: test-interceptor2',
        'onEmit: test-interceptor1 test-interceptor1 data true',
        'onEmit: test-interceptor2 test-interceptor2 data true',
        'onEmit: test-interceptor2 test-interceptor2 data2 false'
    ]
*/
```

#### 4.6 once 参数

once 参数 是否只触发依次

```js
const eventName = 'test-once';
const result = [];

event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, {
    once: true,
    listener () { result.push(2);}
});
event.regist(eventName, {
    once: false,
    listener () {result.push(3);}
});
event.emit(eventName);
event.emit(eventName);
console.log(result);
// [1, 2, 3, 1, 3]
```

#### 4.7 times 参数

times 参数 监听触发的次数

```js
const eventName = 'test-times';
const result = [];

event.regist(eventName, {
    times: 1,
    listener () { result.push(1);}
});
event.regist(eventName, {
    times: 2,
    listener () { result.push(2);}
});
event.regist(eventName, {
    times: 3,
    listener () { result.push(3);}
});
event.emit(eventName);
event.emit(eventName);
event.emit(eventName);
event.emit(eventName);
// [1, 2, 3, 2, 3, 3]
```

#### 4.8 order 参数

控制插入事件的序号（和 index参数有区别）

```js
const eventName = 'test-order';
            
const result = [];
event.regist(eventName, () => {
    result.push(1); // 1
});
event.regist(eventName, () => {
    result.push(2); // 1 2
});
event.regist(eventName, {
    order: 0, // 0 1 2
    listener () {result.push(3);}
});
event.regist(eventName, {
    order: 1, // 0 1 *1 2
    listener () {result.push(4);}
});
event.regist(eventName, {
    order: 1, // 0 1 *1 **1 2
    listener () {result.push(5);}
});
event.regist(eventName, {
    order: 1, // 0 ***1 1 *1 **1 2
    orderBefore: true,
    listener () {result.push(6);}
});
event.regist(eventName, {
    order: 10, // 0 ***1 1 *1 **1 2 10
    listener () {result.push(7);}
});
event.regist(eventName, () => { // 0 ***1 1 *1 **1 2 3 10
    result.push(8);
});
event.emit(eventName);
console.log(result);
```

#### 4.9 single 参数

单例监听模式，对某个事件名启用 single 参数会覆盖之前该事件的所有监听函数

且之后该事件无需再带上 single 参数

启用single参数时， index order orderBefore 参数无效

```js
const eventName = 'test-single';
const result = [];

event.regist(eventName, () => {
    result.push(1);
});
event.emit(eventName);
// 测试覆盖旧方法
event.regist(eventName, {
    single: true,
    immediate: false,
    listener: () => {
        result.push(2);
    }
});
event.emit(eventName);
event.clear(eventName);

event.regist(eventName, {
    single: true,
    listener () { result.push(3);}
});
event.regist(eventName, {
    single: true,
    listener () { result.push(4);}
});
event.emit(eventName);
// 测试single参数缓存
event.regist(eventName, {
    immediate: false,
    listener () { result.push(5);}
});
event.emit(eventName);
console.log(result);
// [1, 2, 4, 5]
```
#### 4.10 name 参数

name 参数用来给一个监听增加一个参数

默认值为 eventName + id

```js
const eventName = 'test-name';
    
const item1 = event.regist(eventName, () => {
});
const item2 = event.regist(eventName, {
    name: 'listener-name',
    listener () {}
});
// item1.name === 'test-name-1'
// item2.name === 'listener-name'
```

#### 4.11 head 参数

head参数用于将监听添加到事件头部

```js
const eventName = 'test-head';
const result = [];
event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, {
    order: -1,
    listener () {result.push(2);}
});
event.regist(eventName, {
    index: -1,
    listener () {result.push(3);}
});
event.regist(eventName, {
    head: true,
    listener () {result.push(4);}
});
event.regist(eventName, {
    head: true,
    listener () {result.push(5);}
});
event.emit(eventName);
// result: [5, 4, 3, 2, 1]
```

#### 4.12 tail 参数

tail参数用于将监听添加到事件尾部

```js
const eventName = 'test-tail';
const result = [];
event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, {
    order: 100,
    listener () {result.push(2);}
});
event.regist(eventName, {
    index: 100,
    listener () {result.push(3);}
});
event.regist(eventName, {
    listener () {result.push(4);}
});
event.regist(eventName, {
    tail: true,
    listener () {result.push(5);}
});
event.regist(eventName, {
    tail: true,
    listener () {result.push(6);}
});
event.emit(eventName);
// result: [1, 4, 2, 3, 5, 6]
```

#### 4.13 order 函数

获取某个监听的序号

```js
const eventName = 'test-order-fn';
const result = [];

event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, () => {
    result.push(2);
});
const e1 = event.regist(eventName, () => {
    result.push(3);
});
const e2 = event.regist(eventName, {
    order: 1,
    listener () { result.push(4);}
});
event.regist(eventName, () => {
    result.push(5);
});
event.emit(eventName);
console.log([result, event.order(eventName), e1.order, e2.order]);
// [[1, 4, 2, 3, 5], 4, 3, 1
```

#### 4.14 remove 函数

移除事件监听

```js
const eventName = 'test-remove';
const result = [];
const l4 = () => { result.push(4); };
const l5 = () => { result.push(5); };
const l6 = () => { result.push(6); };
const l7 = () => { result.push(7); };
event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, () => {
    result.push(2);
});
event.regist(eventName, () => {
    result.push(3);
    event.remove(eventName, l4, true);
    event.remove(eventName, l5);
    event.regist(eventName, l7);
});
event.regist(eventName, l4);
event.regist(eventName, l5);
event.regist(eventName, l6);
event.remove(eventName, l6);
event.emit(eventName);
event.emit(eventName);
console.log(result);
// [1, 2, 3, 7, 5, 1, 2, 3, 7, 7]
```

#### 4.15 registNotImmediate

```js
event.registNotImmediate('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    immediate: false,
    listener: ()=>{}
})
```

#### 4.16 registOnce

```js
event.registOnce('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    once: true,
    listener: ()=>{}
})
```

#### 4.17 registNotImmediateOnce

```js
event.registNotImmediateOnce('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    immediate: false,
    once: true,
    listener: ()=>{}
})
```

#### 4.18 registSingle

```js
event.registSingle('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    single: true,
    listener: ()=>{}
})
```

#### 4.19 监听回调参数

监听函数第二个参数是一个json，包含有三个属性

1. firstEmit 表示该监听是否是首次触发
2. remove 是移除当前监听的方法
3. clear 是移除当前事件的方法
4. item 是当前的监听对象

```js
event.regist('xxx', (data, {firstEmit, item, remove, clear})=>{

})
```

#### 4.20 链式调用

regist函数当指传入事件名时会启用链式调用

所有参数都可通过链式调用，所有api都是可选的，最后需要通过 listen 方法触发监听


```js
event.regist('xxx')
    .index(1)
    .order(1)
    .orderBefore()
    .notImmediate()
    .single()
    .once()
    .times(1)
    .listener()
    .name('xxx')
    .head()
    .tail()
    .listen();
```

声明文件如下

```ts
interface ILink {
    single: (single: boolean) => ILink;
    notImmediate: (immediate: boolean) => ILink;
    once: (once: boolean) => ILink;
    index: (index: number) => ILink;
    order: (order: number) => ILink;
    orderBefore: (orderBefore: boolean) => ILink;
    listener: (listener: IEventListener) => ILink;
    name: (name: string) => ILink;
    head: () => ILink;
    tail: ()=> ILink;
    times: (times: number)=> ILink;
    listen: (listener?: IEventListener) => IEventItem;
}
```

### 5 ts 接口

 1. IEventRegistOption
 2. IRegistObject
 3. IEventListener
 5. IEventItem

详情请参考 [index.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/index.d.ts)

```ts
export interface IEventRegistOption {
    listener: IEventListener;
    immediate?: boolean;
    once?: boolean;
    times?: number;
    order?: number;
    orderBefore?: boolean;
    index?: number;
    single?: boolean;
    head?: boolean;
    tail?: boolean;
    name?: string;
}
export interface IRegistObject {
    [key: string]: IEventRegistOption;
}
export interface IEventListener {
    (data: any, listenOption: {
        firstEmit: boolean;
        item: IEventItem;
        remove: () => boolean;
        clear: () => boolean;
    }): void;
}
export interface IEventItem {
    eventName: TEventName;
    listener: IEventListener;
    immediate: boolean;
    once: boolean;
    order: number;
    orderBefore: boolean;
    hasTrigger: boolean;
    id: number;
    single: boolean;
    name: string;
    head: boolean;
    tail: boolean;
    times: number;
    timesLeft: number;
}
```