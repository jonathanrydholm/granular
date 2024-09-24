import { IWatcher } from '../Types';

export function UsePolling(usePolling: boolean) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.usePolling = function () {
            return usePolling;
        };
    };
}
