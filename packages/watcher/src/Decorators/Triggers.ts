import { IWatchableEvent, IWatcher } from '../Types';

export function Triggers(triggers: IWatchableEvent[]) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.triggers = function () {
            return triggers;
        };
    };
}
