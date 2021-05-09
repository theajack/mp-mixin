/*
 * @Author: tackchen
 * @Date: 2021-05-02 11:11:35
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-09 09:27:25
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

interface IBaseMixin {
    data?: IJson;
    methods?: IJson<Function>;

    onLoad?(query: any): void | Promise<void>
    onShow?(): void | Promise<void>
    onReady?(): void | Promise<void>
    onHide?(): void | Promise<void>
    onUnload?(): void | Promise<void>
    onPullDownRefresh?(): void | Promise<void>
    onReachBottom?(): void | Promise<void>
    onShareAppMessage?(options: {
        from: 'button' | 'menu' | string
        target: any
        webViewUrl?: string
    }): {
        title?: string
        path?: string
        imageUrl?: string
    } | void
    onShareTimeline?(): {
        title?: string
        query?: string
        imageUrl?: string
    } | void
    onPageScroll?(options: {
        scrollTop: number
    }): void | Promise<void>
    onTabItemTap?(options: {
        index: string
        pagePath: string
        text: string
    }): void | Promise<void>
    onResize?(options: {
        size: {
            windowWidth: number
            windowHeight: number
        }
    }): void | Promise<void>
    onAddToFavorites?(options: {webviewUrl?: string}): {
        title?: string
        imageUrl?: string
        query?: string
    }
}

export interface ILocalMixin extends IBaseMixin {
    store?: IStore;
}

export interface IGlobalMixin extends IBaseMixin {
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