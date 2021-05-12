/*
 * @Author: tackchen
 * @Date: 2021-05-02 11:11:35
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-12 13:53:26
 * @FilePath: \mp-mixin\src\type.d.ts
 * @Description: Coding something
 */

export interface IStore {
    state: IJson;
    __: {
        _id: number;
        _injectContext (currentContext: IContext, storeTool: IJson): void;
        _hitState (setDataAttr: string, value: any, ignoreList: string[], newContext: IContext): boolean;
    }
}

export interface IEventReady<T> {
    onEventReady(fn: (...args: T[])=>void, ...args: T[]): Function;
    eventReady(...args: T[]): void;
    removeListener(fn: Function): void;
}

export interface IJson<T = any> {
    [prop: string]: T;
}

interface IMixinOption {
    data?: IJson;
    mixin?: IPageMixin;
}

export interface IPageLifeTimes {
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
export interface IPageOption extends IJson, IMixinOption, IPageLifeTimes {
}

interface IComponentLifetimeOptions {
    lifetimes?: IComponentLifeTimes; // 仅针对组件有效
    pageLifetimes?: IComponentPageLifeTimes; // 仅针对组件有效
}
export interface IComponentOption extends IPageOption, IMixinOption, IComponentLifetimeOptions {
    methods?: IJson<Function>;
}

interface IBaseMixin {
    data?: IJson;
    methods?: IJson<Function>;
}

export interface IPageMixin extends IBaseMixin, IPageLifeTimes {
    store?: IStore;
}

export interface IComponentMixin extends IBaseMixin, IComponentLifetimeOptions {
    store?: IStore;
}

export interface IGlobalMixin extends IBaseMixin, IPageLifeTimes, IComponentLifetimeOptions {
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

export interface IComponentLifeTimes {
    created?(): void;
    attached?(): void;
    ready?(): void;
    moved?(): void;
    detached?(): void;
    error?(err: {
        name: string;
        message: string;
        stack?: string;
    }): void;
}

export interface IComponentPageLifeTimes {
    show?(): void;
    hide?(): void;
    resize?(size: {
        size: {
            windowWidth: number;
            windowHeight: number;
        };
    }): void;
}