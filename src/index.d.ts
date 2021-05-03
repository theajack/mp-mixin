/*
 * @Author: tackchen
 * @Date: 2021-05-02 11:11:41
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-04 00:55:09
 * @FilePath: \mp-mixin\src\index.d.ts
 * @Description: Coding something
 */

import {IGlobalMixinFn, ICreateStoreFn, IInitGlobalStoreFn} from './type';

interface IInjectStaff {
    (target: object & {
        mixin?: IGlobalMixinFn;
        createStore?: ICreateStoreFn;
        initGlobalStore?: IInitGlobalStoreFn;
    }): void;
}

export const injectStaff: IInjectStaff;
export const globalMixin: IGlobalMixinFn;
export const createStore: ICreateStoreFn;
export const initGlobalStore: IInitGlobalStoreFn;
export const version: string;

export default {
    globalMixin,
    createStore,
    initGlobalStore,
    version,
    injectStaff,
};