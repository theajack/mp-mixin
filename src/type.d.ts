/*
 * @Author: tackchen
 * @Date: 2021-05-02 11:11:35
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-02 14:37:06
 * @FilePath: \mp-mixin\src\type.d.ts
 * @Description: Coding something
 */
export interface IStore {
    state: IJson;
    __id: number;
    __injectContext (currentContext: IContext): void;
    __hitState (setDataAttr: string, value: any): boolean;
}

export interface IEventReady<T> {
    onEventReady(fn: (...args: T[])=>void, ...args: T[]): void;
    eventReady(...args: T[]): void;
}

export interface IJson<T = any> {
    [prop: string]: T;
}

declare global {
    let Page: (options: IPageOption) => void;
    const wx: object;
    const qq: object;
}

export declare interface IPageOption extends IJson{
    data: IJson;
    mixin?: ILocalMixin;
}

export type TLifeTime = 'onLoad' | 'onShow' | 'onReady' | 'onHide' | 'onShow' | 'onUnload' | 'onPullDownRefresh' |
    'onReachBottom' | 'onShareAppMessage' | 'onShareTimeline' | 'onAddToFavorites' | 'onPageScroll' | 'onResize' | 'onTabItemTap';

type TBaseMixin = {
    [prop in TLifeTime]?: Function;
} & {
    data?: IJson;
    methods?: IJson<Function>;
};

export interface ILocalMixin extends TBaseMixin {
    store?: IStore;
}

export interface IGlobalMixin extends TBaseMixin {
    store?: IStore | IJson;
}

export interface IContext extends IJson {
    setData(data: IJson, callbacl?: Function): void;
}

export interface IGlobalMixinFn {
    (mixin: IGlobalMixin): void;
}
export interface ICreateStoreFn {
    (state: IJson): IStore;
}
export interface IInitGlobalStoreFn {
    (state: IJson | IStore): IStore;
}