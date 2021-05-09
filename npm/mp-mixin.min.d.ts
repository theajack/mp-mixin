/*
 * @Author: tackchen
 * @Date: 2021-05-02 11:11:41
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-09 09:17:22
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

type Optional<F> = F extends (arg: infer P) => infer R ? (arg?: P) => R : F
type OptionalInterface<T> = { [K in keyof T]: Optional<T[K]> }

declare global {
    namespace WechatMiniprogram {
        
        interface Wx {
            mixin: IGlobalMixinFn;
            createStore: ICreateStoreFn;
            initGlobalStore: IInitGlobalStoreFn;
        }
    }
    namespace WechatMiniprogram.Page {
        interface ILifetime {}
        
        interface Data<D> {
            mixin?: ILocalMixin & OptionalInterface<WechatMiniprogram.Page.ILifetime>;
        }
    }
}

declare const mpMixin: IMpMixin;

export default mpMixin;