/*
 * @Author: tackchen
 * @Date: 2021-05-01 20:29:47
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-02 12:15:49
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
        __id: currentId,
        state,
        __injectContext (currentContext: IContext) {
            const initedFlag = `__storeInited_${currentId}`;
            if (currentContext[initedFlag]) {
                return;
            }
            currentContext[initedFlag] = true;
            hackSetData(currentContext, this);
            onEventReady((data) => {
                currentContext.__nativeSetData(data);
            });
        },
        __hitState (setDataAttr: string, value: any) {
            const attrs = getAttrs(setDataAttr);
            if (typeof state[attrs[0]] === 'undefined') {
                return false;
            }
            modifyState(attrs, value, setDataAttr);
            return true;
        }
    };
}

function hackSetData (context: IContext, store: IStore) {
    const nativeSetData = context.setData;
    if (!context.__setDataList) {
        context.__setDataList = [];
        context.__nativeSetData = nativeSetData;
        context.setData = (data, callback) => {
            context.__setDataList.forEach((fn: Function) => fn(data));
            return nativeSetData.call(context, data, callback);
        };
    }
    context.__setDataList.push((data: IJson) => {
        for (const k in data) {
            store.__hitState(k, data[k]);
        }
    });
}

function handleSetDataAttr (attr: string) {
    attr = attr.replace(/\[/g, '.').replace(/\]/g, '');
    return attr.split('.');
}

export function initStoreHacker (options: IPageOption) {
    handleStore(options, options.$globalStore);
    handleStore(options, options.$store);
}

function handleStore (options: IPageOption, store: IStore) {
    if (!store) return;
    const setDataHacker = function (context: IContext) {
        store.__injectContext(context);
    };
    if (!options.onLoad) { // 劫持onLoad来注入setData
        options.onLoad = setDataHacker;
    } else {
        const nativeOnLoad = options.onLoad;
        if (!options.__onLoadList) {
            options.__onLoadList = [];
            options.onLoad = function (...args: any[]) {
                options.__onLoadList.forEach((fn: Function) => fn(this));
                nativeOnLoad.apply(this, args);
            };
        }
  
        options.__onLoadList.push(function (context: IContext) {
            setDataHacker(context);
        });
    }
}

export function _initGlobalStore (state: IJson | IStore) {
    globalStore = ((!state.__id) ? _createStore(state) : state) as IStore;
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
    const store = (global) ? globalStore : (options.store || mixinStore);
    if (!store) return;

    options[global ? '$globalStore' : '$store'] = store;

    mapToTarget({
        data: store.state,
        target: options.data
    });
}