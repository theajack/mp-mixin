/*
 * @Author: tackchen
 * @Date: 2021-05-01 18:27:03
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-11 23:41:24
 * @FilePath: \mp-mixin\src\index.ts
 * @Description: Coding something
 */

import {TARGET_TYPE} from './constant';
import {_globalMixin, mixinCurrent, _mixinGlobal} from './mixin';
import {_createStore, _initGlobalStore, initStoreHacker} from './store';
import {IPageOption, IGlobalMixinFn, ICreateStoreFn, IInitGlobalStoreFn, IComponentOption, IJson} from './type';
import _version from './version';

declare global {
    let Page: (options: IPageOption) => void;
    let Component: (options: IComponentOption) => void;
    const wx: object;
    const qq: object;
}

// 注入一些全局方法
function hackPageBuilder () {
    const nativePage = Page;
    Page = function (options: IPageOption) {
        nativePage(mixinMainProcess(options));
    };
}

function hackComponentBuilder () {
    const nativeComponent = Component;
    Component = function (options: IComponentOption) {
        nativeComponent(mixinMainProcess(options, TARGET_TYPE.COMPONENT));
    };
}

export function mixinMainProcess (
    options: IPageOption | IComponentOption,
    type: TARGET_TYPE = TARGET_TYPE.PAGE
) {
    if (!options.data) { options.data = {}; }
    const storeTool: IJson = {};
    options = _mixinGlobal({options, type, storeTool});

    options = mixinCurrent({options, type, storeTool});

    initStoreHacker({options, type, storeTool});

    return options;
}

function main () {
    hackPageBuilder();
    hackComponentBuilder();
  
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

const mpMixin = {
    globalMixin,
    createStore,
    initGlobalStore,
    version,
    injectStaff,
};

export default {
    globalMixin,
    createStore,
    initGlobalStore,
    version,
    injectStaff,
    default: mpMixin, // 对于微信ts编译的 default 的兼容
};