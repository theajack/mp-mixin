/*
 * @Author: tackchen
 * @Date: 2021-05-01 20:29:47
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-02 14:55:50
 * @FilePath: \mp-mixin\src\store.ts
 * @Description: Coding something
 */

import {IContext, IJson, IPageOption, IStore} from './type';
import {mapToTarget, creatEventReady} from './util';

let globalStore: IStore;
let storeId = 0;
export function _createStore (state: IJson): IStore {
    const currentId = ++storeId;
    // 缓存setData key
    const attrMap: IJson<string[]> = {};
    const getAttrs = (setDataAttr: string) => {
        if (!attrMap[setDataAttr]) {
            attrMap[setDataAttr] = handleSetDataAttr(setDataAttr);
        }
        return attrMap[setDataAttr];
    };
    const {onEventReady, eventReady} = creatEventReady<IJson>();

    const modifyState = (
        attrs: string[], value: any, setDataAttr: string
    ) => {
        let data = state;
        const last = attrs.length - 1;
        attrs.forEach((attr: string, index: number) => {
            if (index === last) {
                data[attr] = value;
                eventReady({[setDataAttr]: value});
            } else {
                if (typeof data[attr] === 'undefined') {
                    throw new Error(`错误的 setData 属性:${setDataAttr}`);
                }
                data = data[attr];
            }
        });
    };

    return {
        state,
        __: {
            _id: currentId,
            _injectContext (currentContext: IContext) {
                const mixin = currentContext.__mixin;
                if (mixin._store[currentId].inited) {
                    return;
                }
                mixin._context = currentContext;
                mixin._store[currentId].inited = true;
                hackSetData(currentContext, currentId);
                onEventReady((data) => {
                    mixin._nativeSetData.call(currentContext, data);
                });
            },
            _hitState (setDataAttr: string, value: any, ignoreList: string[]) {
                const attrs = getAttrs(setDataAttr);
                const modifyAttr = attrs[0];
                if (typeof state[modifyAttr] === 'undefined' || ignoreList.includes(modifyAttr)) {
                    return false;
                }
                modifyState(attrs, value, setDataAttr);
                return true;
            }
        }
    };
}

function hackSetData (context: IContext, storeId: number) {
    const nativeSetData = context.setData;
    const mixin = context.__mixin;
    if (!mixin._setDataList) {
        mixin._setDataList = [];
        mixin._nativeSetData = nativeSetData;
        context.setData = (data, callback) => {
            mixin._setDataList.forEach((fn: Function) => fn(data));
            return nativeSetData.call(context, data, callback);
        };
    }
    mixin._setDataList.push((data: IJson) => {
        const {store, ignoreList} = mixin._store[storeId];
        for (const k in data) {
            store.__._hitState(k, data[k], ignoreList);
        }
    });
}

function handleSetDataAttr (attr: string) {
    attr = attr.replace(/\[/g, '.').replace(/\]/g, '');
    return attr.split('.');
}

export function initStoreHacker (options: IPageOption) {
    const stores = options.__mixin._store;
    if (stores) {
        for (const k in stores) {
            handleStore(options, stores[k].store);
        }
    }
}

function handleStore (options: IPageOption, store: IStore) {
    if (!store) return;
    const setDataHacker = function (context: IContext) {
        store.__._injectContext(context);
    };
    if (!options.onLoad) { // 劫持onLoad来注入setData
        options.onLoad = setDataHacker;
    } else {
        const nativeOnLoad = options.onLoad;
        const mixin = options.__mixin;
        if (!mixin._onLoadList) {
            mixin._onLoadList = [];
            options.onLoad = function (...args: any[]) {
                mixin._onLoadList.forEach((fn: Function) => fn(this));
                nativeOnLoad.apply(this, args);
            };
        }
  
        mixin._onLoadList.push(function (context: IContext) {
            setDataHacker(context);
        });
    }
}

export function _initGlobalStore (state: IJson | IStore) {
    globalStore = ((!state.__) ? _createStore(state) : state) as IStore;
    return globalStore;
}

export function checkGlobalMixinStore (store?: IJson | IStore) {
    if (!store) return;
    _initGlobalStore(store);
}

export function injectStore (
    options: IPageOption,
    mixinStore?: IStore | IJson<any>,
    global = false
) {
    const store = ((global) ? globalStore : (options.store || mixinStore)) as IStore;
    if (!store) return;
    const mixin = options.__mixin;
    if (!mixin._store) {mixin._store = {};};
    mixin._store[store.__._id] = {
        store,
        ignoreList: mapToTarget({
            data: store.state,
            target: options.data
        })
    };
}