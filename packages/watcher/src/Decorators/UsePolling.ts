import { IWatcher } from '../Types';
import { IUsePollingOptions } from '../Types';

/**
 * Whether to use fs.watchFile (backed by polling), or fs.watch.
 * If polling leads to high CPU utilization, consider setting this to false.
 * It is typically necessary to set this to true to successfully watch files over a network,
 * and it may be necessary to successfully watch files in other non-standard situations.
 * Setting to true explicitly on MacOS overrides the useFsEvents default
 * You may also set the CHOKIDAR_USEPOLLING env variable to true (1) or false (0) in order to override this option.
 */
export function UsePolling(usePolling: IUsePollingOptions) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.usePolling = function () {
            return usePolling;
        };
    };
}
