/*
 * @Author: tackchen
 * @Date: 2021-05-01 20:29:47
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-12 13:57:57
 * @FilePath: \mp-mixin\src\store.ts
 * @Description: 状态共享
 */

import {TARGET_TYPE} from './constant';
import {IComponentOption, IContext, IJson, IPageOption, IStore} from './type';
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
    const {onEventReady, eventReady, removeListener} = creatEventReady<IJson>();

    const modifyState = (
        attrs: string[], value: any, setDataAttr: string, newContext: IContext
    ) => {
        let data = state;
        const last = attrs.length - 1;
        attrs.forEach((attr: string, index: number) => {
            if (index === last) {
                data[attr] = value;
                eventReady({[setDataAttr]: value}, newContext);
            } else {
                if (typeof data[attr] === 'undefined') {
                    throw new Error(`Error setData:${setDataAttr}`);
                }
                data = data[attr];
            }
        });
    };

    return {
        state,
        __: {
            _id: currentId,
            _injectContext (currentContext: IContext, storeTool: IJson) {
                hackSetData(currentContext, currentId, storeTool);
                const listener = onEventReady((data, newContext) => {
                    if (currentContext.__unload) {
                        // ! 对已经不再显示的 page或组件 取消监听
                        removeListener(listener);
                    } else if (currentContext !== newContext) {
                        // ! 仅对其他页面或组件进行出发 setData
                        console.log('onEventReady', data);
                        storeTool._nativeSetData.call(currentContext, data);
                    }
                });
            },
            _hitState (setDataAttr: string, value: any, ignoreList: string[], newContext: IContext) {
                const attrs = getAttrs(setDataAttr);
                const modifyAttr = attrs[0];
                if (typeof state[modifyAttr] === 'undefined' || ignoreList.indexOf(modifyAttr) !== -1) {
                    return false;
                }
                modifyState(attrs, value, setDataAttr, newContext);
                return true;
            }
        }
    };
}
// todo 有待增加 对组件和page原有属的处理 默认是Page会覆盖 组件会忽略

// todo 有待测试组件局部使用 mixin
// todo 有待测试多个 store 在一个组件或者page上的场景，包含局部 + 全局；多个局部+全局；多个局部三个场景
function hackSetData (context: IContext, storeId: number, storeTool: IJson) {
    const nativeSetData = context.setData;
    // ! _setDataList 需要挂在 context上而不能挂在storeTool上 因为每次onload出来的都是一个新的context
    // ! 而 storeTool 是同一个
    if (!context._setDataList) {
        context._setDataList = [];
        storeTool._nativeSetData = nativeSetData;
        context.setData = (data, callback) => {
            context._setDataList.forEach((fn: Function) => fn(data));
            console.log('nativeSetData.call(context, data, callback);', data);
            return nativeSetData.call(context, data, callback);
        };
    }
    context._setDataList.push((data: IJson) => {
        const {store, ignoreList} = storeTool._store[storeId];
        for (const k in data) {
            store.__._hitState(k, data[k], ignoreList, context);
        }
    });
}

function handleSetDataAttr (attr: string) {
    attr = attr.replace(/\[/g, '.').replace(/\]/g, '');
    return attr.split('.');
}


export function initStoreHacker ({
    options,
    type,
    storeTool,
}: {
    options: IPageOption;
    type: TARGET_TYPE;
    storeTool: IJson;
}) {
    const stores = storeTool._store;
    if (stores) {
        for (const k in stores) {
            handleStore({
                options,
                store: stores[k].store,
                type,
                storeTool
            });
        }
    }
}

function readOnloadLifeTime (options: IPageOption | IComponentOption, type: TARGET_TYPE) {
    if (type === TARGET_TYPE.PAGE) {
        return options.onLoad;
    } else if (type === TARGET_TYPE.COMPONENT) {
        if (options.lifetimes) {
            return options.lifetimes.attached; // 使用attached 而不使用 created，因为created中不可使用setData
        }
    }
    return null;
}

function writeOnloadLifeTime (
    options: IPageOption | IComponentOption,
    type: TARGET_TYPE,
    func: (this: IContext) => void
) {
    if (type === TARGET_TYPE.PAGE) {
        options.onLoad = func;
    } else if (type === TARGET_TYPE.COMPONENT) {
        if (!options.lifetimes) {options.lifetimes = {};}
        options.lifetimes.attached = func;
    }
}

function handleStore ({
    options,
    store,
    type,
    storeTool,
}: {
    options: IPageOption | IComponentOption;
    store: IStore;
    type: TARGET_TYPE;
    storeTool: IJson;
}) {
    if (!store) return;
    const setDataHacker = function (this: IContext) {
        store.__._injectContext(this, storeTool);
    };
    const nativeOnLoad = readOnloadLifeTime(options, type);
    if (!nativeOnLoad) { // 劫持onLoad来注入setData
        writeOnloadLifeTime(options, type, setDataHacker);
    } else {
        if (!storeTool._onLoadList) {
            storeTool._onLoadList = [];
            const onLoadHacker = function (this: IContext, ...args: any[]) {
                storeTool._onLoadList.forEach((fn: (this: IContext) => void) => fn.call(this));
                nativeOnLoad.apply(this, args);
            };
            writeOnloadLifeTime(options, type, onLoadHacker);
        }
  
        storeTool._onLoadList.push(setDataHacker);
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

export function injectStore ({
    options,
    mixinStore,
    storeTool,
    global = false,
}: {
    options: IPageOption;
    mixinStore?: IStore | IJson<any>;
    storeTool: IJson;
    global?: boolean;
}) {
    if (typeof options.data === 'undefined') return;
    const store = ((global) ? globalStore : (options.store || mixinStore)) as IStore;
    if (!store) return;
    if (!storeTool._store) {storeTool._store = {};};
    storeTool._store[store.__._id] = {
        store,
        ignoreList: mapToTarget({
            data: store.state,
            target: options.data
        })
    };
}