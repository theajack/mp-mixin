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
    <a href="https://www.jsdelivr.com/package/npm/mp-mixin" target="_black">
        <img src="https://data.jsdelivr.com/v1/package/npm/mp-mixin/badge" alt="jsdelivr" />
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

<h3>🚀 Powerful and easy-to-use event library</h3>

**[中文](https://github.com/theajack/mp-mixin/blob/master/README.cn.md) | [Update Log](https://github.com/theajack/mp-mixin/blob/master/helper/version.md) | [Feedback bug](https://github.com/theajack/mp-mixin/issues/new) | [Gitee](https://gitee.com/theajack/mp-mixin)**

---

### 1. Features

1. Typescript writing
2. Multi-terminal support
3. Custom event sequence, multiple trigger modes
4. Global interception mechanism
5. Small size, easy to use

### 2. Quick use

#### 2.1 npm installation

```
npm i mp-mixin
```

```js
import event from 'mp-mixin';

event.regist('myEvent', (data) => {
    console.log('emited!', data);
})

event.emit('myEvent', 'Aha!');
```

#### 2.2 cdn


```html
<script src="https://cdn.jsdelivr.net/npm/mp-mixin/mp-mixin.min.js"></script>
<script>
    TEvent.regist('myEvent', function (data) {
        console.log('emited!', data);
    })

    TEvent.emit('myEvent', 'Aha!');
</script>
```

### 3 api

For details, please refer to [index.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/index.d.ts)

```ts
interface IEventStatic {
    version: string;
    EVENT: IJson<string>; // event enumeration
    emit(name: TEventName, data?: any): boolean; // trigger event
    onEmit(fn: IOnInterceptorEmit): void;
    regist(name: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: IRegistObject, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: IJson<IEventRegistOption>): IJson<IEventItem>;
    regist(name: TEventName): ILink;
    onRegist(fn: IOnInterceptorRegist): void;
    checkEvent(name: TEventName): boolean; // Check if there is an event
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

### 4 Use case

#### 4.1 checkEvent

Determine whether the event exists

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

#### 4.2 clear method

Clear single or all events

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

#### 4.3 immediate parameters

The immediate parameter indicates whether the current event needs to be triggered immediately if the event has already been triggered when registering an event

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

#### 4.4 index parameter

The index parameter indicates the position where you want to insert when registering an event

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

Global interceptor, support onRegist and onEmit

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

#### 4.6 once parameter

once parameter is only triggered sequentially

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
#### 4.7 times parameter

The times parameter is the number of times the monitor is triggered

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

#### 4.8 order parameter

Control the sequence number of the insertion event (different from the index parameter)

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

#### 4.9 single parameter

Singleton monitoring mode, enabling the single parameter for an event name will overwrite all previous monitoring functions for the event

And after this event, there is no need to carry the single parameter

When the single parameter is enabled, the index order orderBefore parameter is invalid

```js
const eventName = 'test-single';
const result = [];

event.regist(eventName, () => {
    result.push(1);
});
event.emit(eventName);
// Test coverage old method
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
// Test single parameter cache
event.regist(eventName, {
    immediate: false,
    listener () { result.push(5);}
});
event.emit(eventName);
console.log(result);
// [1, 2, 4, 5]
```

#### 4.10 name parameter

The name parameter is used to add a parameter to a monitor

The default value is eventName + id

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

#### 4.11 head parameters

The head parameter is used to add the listener to the event head


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

#### 4.12 tail parameters

The tail parameter is used to add the listener to the end of the event

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

#### 4.13 order method

Get the serial number of a monitor

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

#### 4.14 remove method

Remove event listener

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
// equals
event.regist('xxx', {
    immediate: false,
    listener: ()=>{}
})
```

#### 4.16 registOnce

```js
event.registOnce('xxx', ()=>{})
// equals
event.regist('xxx', {
    once: true,
    listener: ()=>{}
})
```

#### 4.17 registNotImmediateOnce

```js
event.registNotImmediateOnce('xxx', ()=>{})
// equals
event.regist('xxx', {
    immediate: false,
    once: true,
    listener: ()=>{}
})
```

#### 4.18 registSingle

```js
event.registSingle('xxx', ()=>{})
// equals
event.regist('xxx', {
    single: true,
    listener: ()=>{}
})
```

#### 4.19 Monitor callback parameters

The second parameter of the monitoring function is a json, which contains three attributes

1. firstEmit indicates whether the monitor is triggered for the first time
2. remove is the method to remove the current monitor
3. clear is the method to remove the current event
4. item is the current monitoring object

```js
event.regist('xxx', (data, {firstEmit, item, remove, clear})=>{

})
```

#### 4.20 Chain call

The regist function will enable chained calls when referring to the incoming event name

All parameters can be called by chain, all apis are optional, and finally need to be triggered through the listen method

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

The declaration file is as follows

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

### 5 ts interface

 1. IEventRegistOption
 2. IRegistObject
 3. IEventListener
 5. IEventItem

For details, please refer to [index.d.ts](https://github.com/theajack/mp-mixin/blob/master/src/index.d.ts)

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