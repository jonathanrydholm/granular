import { IWatchableEvent, IWatcher } from '../Types';

/**
 * Types of events the watcher should react to
 */
export function Triggers(triggers: IWatchableEvent[]) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.triggers = function () {
            return triggers;
        };
    };
}
