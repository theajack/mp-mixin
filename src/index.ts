/*
 * @Author: tackchen
 * @Date: 2021-05-01 18:27:03
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-02 14:22:15
 * @FilePath: \mp-mixin\src\index.ts
 * @Description: Coding something
 */

import {_globalMixin, mixinCurrentPage, _mixinGlobalObject} from './mixin';
import {_createStore, _initGlobalStore, initStoreHacker} from './store';
import {IPageOption, IGlobalMixinFn, ICreateStoreFn, IInitGlobalStoreFn} from './type';

// 注入一些全局方法
function hackPageBuilder () {
    const nativePage = Page;
    Page = function (options: IPageOption) {
        if (!options.data) { options.data = {}; }
    
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
}) {
    target.mixin = _globalMixin;
    target.createStore = _createStore;
    target.initGlobalStore = _initGlobalStore;
}

export const globalMixin = _globalMixin;
export const createStore = _createStore;
export const initGlobalStore = _initGlobalStore;