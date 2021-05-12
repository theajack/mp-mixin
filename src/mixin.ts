/*
 * @Author: tackchen
 * @Date: 2021-05-01 19:32:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-12 13:56:45
 * @FilePath: \mp-mixin\src\mixin.ts
 * @Description: Coding something
 */

import {TARGET_TYPE} from './constant';
import {checkGlobalMixinStore, injectStore} from './store';
import {IComponentMixin, IComponentOption, IContext, IGlobalMixin, IJson, IPageMixin, IPageOption} from './type';
import {deepClone, mapToTarget, pick} from './util';

let globalMixins: IGlobalMixin;

const pageLifeTimeNames = [
    'onLoad',
    'onShow',
    'onReady',
    'onHide',
    'onShow',
    'onUnload',

    'onPullDownRefresh',
    'onReachBottom',
    'onShareAppMessage',
    'onShareTimeline',
    'onAddToFavorites',
    'onPageScroll',
    'onResize',
    'onTabItemTap',
];

export function mixinData (options: IPageOption, data?: IJson) {
    if (typeof data === 'undefined' || typeof options.data === 'undefined') return;
    mapToTarget({
        data,
        target: options.data
    });
}

function mixinMethods (
    options: IPageOption | IComponentOption,
    methods?: IJson<Function>,
    type: TARGET_TYPE = TARGET_TYPE.PAGE
) {
    if (!methods) return;
    const isComponent = type === TARGET_TYPE.COMPONENT;
    if (isComponent && !options.methods) {
        options.methods = {};
    }
    mapToTarget({
        data: methods,
        target: isComponent ?
            (options as IComponentOption).methods as IJson<Function> :
            options
    });
}

function mixinLifeTimes (
    options: IPageOption,
    mixin: IGlobalMixin | IPageMixin
) {
    const leftTimes = pick(mixin, pageLifeTimeNames);
    
    mapToTarget({
        data: leftTimes,
        target: options
    });

    markUnload(options);
}

// ! 标记 当前组件或页面被unload了， 用户store中取消监听
function markUnload (leftTimes: IJson, type: TARGET_TYPE = TARGET_TYPE.PAGE) {
    const markUnloadFlag = function (this: IContext) {
        this.__unload = true;
    };
    const name = type === TARGET_TYPE.PAGE ? 'onUnload' : 'detached';
    if (leftTimes[name]) {
        const nativeMethod = leftTimes[name];
        leftTimes[name] = function (this: IContext) {
            nativeMethod.call(this);
            markUnloadFlag.call(this);
        };
    } else {
        leftTimes[name] = markUnloadFlag;
    }
}

function mixinComponentLifeTimes (
    options: IComponentOption,
    mixin: IComponentMixin
) {
    const leftTimes = mixin.lifetimes;

    if (!options.lifetimes) {options.lifetimes = {};}
    if (leftTimes) {
        mapToTarget({
            data: leftTimes,
            target: options.lifetimes
        });
    }
    markUnload(options.lifetimes, TARGET_TYPE.COMPONENT);

    const pageLiftTimes = mixin.pageLifetimes;
    if (pageLiftTimes) {
        if (!options.pageLifetimes) {options.pageLifetimes = {};}
        mapToTarget({
            data: pageLiftTimes,
            target: options.pageLifetimes
        });
    }
}

export function mixinCurrent ({
    options,
    mixin,
    global = false,
    type = TARGET_TYPE.PAGE,
    storeTool,
}: {
    options: IPageOption | IComponentOption;
    mixin?: IGlobalMixin | IPageMixin;
    global?: boolean;
    type?: TARGET_TYPE;
    storeTool: IJson;
}) {
    if (typeof mixin === 'undefined') {
        mixin = options.mixin;
    }
    if (typeof mixin === 'undefined') {
        return options;
    }
  
    mixin = deepClone(mixin) as IGlobalMixin | IPageMixin;

    if (type === TARGET_TYPE.PAGE) {
        mixinLifeTimes(options as IPageOption, mixin as IPageMixin);
    } else if (type === TARGET_TYPE.COMPONENT) {
        mixinComponentLifeTimes(options as IComponentOption, mixin as IComponentMixin);
    }
    mixinData(options, mixin.data);
    mixinMethods(options, mixin.methods, type);

    injectStore({options, mixinStore: mixin.store, global, storeTool});

    return options;
}

export function _mixinGlobal ({
    options,
    type,
    storeTool
}: {
    options: IPageOption | IComponentOption;
    type: TARGET_TYPE;
    storeTool: IJson;
}) {
    return mixinCurrent({
        options,
        mixin: globalMixins,
        global: true,
        type,
        storeTool
    });
}

export function _globalMixin (mixin: IGlobalMixin) {
    globalMixins = mixin;
    checkGlobalMixinStore(mixin.store);
}