import { IWatcher } from '../Types';

export function Persistent(persistent: boolean) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.persistent = function () {
            return persistent;
        };
    };
}
