import { IWatcher } from '../Types';
/** Indicates whether the process should continue to run as long as files are being watched. */
export function Persistent(persistent: boolean) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.persistent = function () {
            return persistent;
        };
    };
}
