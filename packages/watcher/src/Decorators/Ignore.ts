import { IIgnore, IWatcher } from '../Types';
/** Acts as a filter for ignoring certain paths */
export function Ignore(callback: IIgnore) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.ignore = function () {
            return callback;
        };
    };
}
