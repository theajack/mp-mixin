/*
 * @Author: tackchen
 * @Date: 2021-05-01 19:32:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-02 11:44:59
 * @FilePath: \mp-mixin\src\mixin.ts
 * @Description: Coding something
 */

import {checkGlobalMixinStore, injectStore} from './store';
import {IGlobalMixin, IJson, ILocalMixin, IPageOption} from './type';
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
    if (typeof data === 'undefined') return;
    mapToTarget({
        data,
        target: options.data
    });
}

function mixinMethods (options: IPageOption, methods?: IJson<Function>) {
    if (!methods) return;

    mapToTarget({
        data: methods,
        target: options
    });
}

function mixinLifeTimes (
    options: IPageOption,
    mixin: IGlobalMixin | ILocalMixin
) {
    const leftTimes = pick(mixin, pageLifeTimeNames);
  
    mapToTarget({
        data: leftTimes,
        target: options
    });
}

export function mixinCurrentPage (options: IPageOption, mixin?: IGlobalMixin | ILocalMixin, global = false) {
    if (typeof mixin === 'undefined') {
        mixin = options.mixin;
    }
    if (typeof mixin === 'undefined') {
        return options;
    }
  
    mixin = deepClone(mixin) as IGlobalMixin | ILocalMixin;

    mixinLifeTimes(options, mixin);
    mixinData(options, mixin.data);
    mixinMethods(options, mixin.methods);

    injectStore(options, mixin.store, global);

    return options;
}

export function _mixinGlobalObject (options: IPageOption) {
    return mixinCurrentPage(options, globalMixins, true);
}

export function _globalMixin (mixin: IGlobalMixin) {
    globalMixins = mixin;
    checkGlobalMixinStore(mixin.store);
}