/*
 * @Author: tackchen
 * @Date: 2021-05-01 19:49:28
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-12 00:53:19
 * @FilePath: \mp-mixin\src\util.ts
 * @Description: Coding something
 */

import {IEventReady, IJson} from './type';

export function deepClone (object: any): any {
    if (typeof object !== 'object') {
        return object;
    }
    const isArray = object instanceof Array;
    if (isArray) {
        return object.map((item: any) => deepClone(item));
    } else {
        const result: IJson = {};
        for (const k in object) {
            result[k] = deepClone(object[k]);
        }
        return result;
    }
}

export function mapToTarget ({
    data, target, force = false
}: {
  data: IJson;
  target: IJson;
  force?: boolean;
}): string[] {
    const ignoreList: string[] = [];
    for (const k in data) {
        if (force || typeof target[k] === 'undefined') {
            target[k] = data[k];
        } else {
            ignoreList.push(k);
        }
        
    }
    return ignoreList;
}

export function pick (data: IJson, attributes: Array<string> = []) {
    const result: IJson = {};
    attributes.forEach(attr => {
        if (typeof data[attr] !== 'undefined') { result[attr] = data[attr]; };
    });
    return result;
}

export function creatEventReady<T = any> (): IEventReady<T> {

    const queue: {
        fn: Function;
        args: T[];
    }[] = [];
    let lastArgs: T[] | null = null;

    function onEventReady (fn: (...args: T[])=>void, ...args: T[]) {
        if (!queue.find(item => item.fn === fn)) {
            queue.push({fn, args});
        }
        if (lastArgs !== null) {
            if (args.length === 0 && lastArgs) {
                args = lastArgs;
            }
            fn(...args);
        }

        return fn;
    }
     
    function eventReady (...args: T[]) {
        lastArgs = args;
        queue.forEach(item => {
            item.fn(...((args.length === 0) ? item.args : args));
        });
    }

    function removeListener (listener: Function) {
        const result = queue.find(item => item.fn === listener);
        if (result) {
            queue.splice(queue.indexOf(result), 1);
        }
    }

    return {
        onEventReady,
        eventReady,
        removeListener,
    };
}