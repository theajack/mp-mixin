/*
 * @Author: tackchen
 * @Date: 2021-05-02 11:11:35
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-09 09:20:15
 * @FilePath: \mp-mixin\src\type.d.ts
 * @Description: Coding something
 */

export interface IStore {
    state: IJson;
    __: {
        _id: number;
        _injectContext (currentContext: IContext): void;
        _hitState (setDataAttr: string, value: any, ignoreList: string[]): boolean;
    }
}
export interface IEventReady<T> {
    onEventReady(fn: (...args: T[])=>void, ...args: T[]): void;
    eventReady(...args: T[]): void;
}

export interface IJson<T = any> {
    [prop: string]: T;
}
export declare interface IPageOption extends IJson{
    data: IJson;
    mixin?: ILocalMixin;
}
type TBaseMixin = {
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