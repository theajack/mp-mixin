/*
 * @Author: tackchen
 * @Date: 2021-05-01 18:27:03
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-04 00:54:51
 * @FilePath: \mp-mixin\src\index.ts
 * @Description: Coding something
 */

import {_globalMixin, mixinCurrentPage, _mixinGlobalObject} from './mixin';
import {_createStore, _initGlobalStore, initStoreHacker} from './store';
import {IPageOption, IGlobalMixinFn, ICreateStoreFn, IInitGlobalStoreFn} from './type';
import _version from './version';

// 注入一些全局方法
function hackPageBuilder () {
    const nativePage = Page;
    Page = function (options: IPageOption) {
        if (!options.data) { options.data = {}; }
        if (!options.__mixin) {options.__mixin = {};}
    
        options = _mixinGlobalObject(options);
    
        options = mixinCurrentPage(options);

        initStoreHacker(options);

        nativePage(options);
    };
}

function main () {
    hackPageBuilder();
  
    if (typeof wx !== 'undefined') {
        injectStaff(wx);
    } else if (typeof qq !== 'undefined') {
        injectStaff(qq);
    }
}

main();

export function injectStaff (target: object & {
  mixin?: IGlobalMixinFn;
  createStore?: ICreateStoreFn;
  initGlobalStore?: IInitGlobalStoreFn;
  mpMixinVersion?: string;
}) {
    target.mixin = _globalMixin;
    target.createStore = _createStore;
    target.initGlobalStore = _initGlobalStore;
    target.mpMixinVersion = _version;
}

export const globalMixin = _globalMixin;
export const createStore = _createStore;
export const initGlobalStore = _initGlobalStore;
export const version = _version;

export default {
    globalMixin,
    createStore,
    initGlobalStore,
    version,
    injectStaff,
};