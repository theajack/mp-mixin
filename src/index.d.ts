/*
 * @Author: tackchen
 * @Date: 2021-05-02 11:11:41
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-09 09:28:09
 * @FilePath: \mp-mixin\src\index.d.ts
 * @Description: Coding something
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {IGlobalMixinFn, ICreateStoreFn, IInitGlobalStoreFn, ILocalMixin} from './type';

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

interface IMpMixin {
    globalMixin: IGlobalMixinFn;
    createStore: ICreateStoreFn;
    initGlobalStore: IInitGlobalStoreFn;
    version: string;
    injectStaff: IInjectStaff;
}

declare global {
    namespace WechatMiniprogram {
        
        interface Wx {
            mixin: IGlobalMixinFn;
            createStore: ICreateStoreFn;
            initGlobalStore: IInitGlobalStoreFn;
        }
    }
    namespace WechatMiniprogram.Page {
        
        interface Data<D> {
            mixin?: ILocalMixin;
        }
    }
}

declare const mpMixin: IMpMixin;

export default mpMixin;