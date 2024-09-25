import { IIgnore } from './IIgnore';
import { IUsePollingOptions } from './IUsePollingOptions';
import { IWatchableEvent } from './IWatchableEvent';

export interface IWatcher {
    /** Path to watch */
    glob(): string;
    /** Will be called when one of the events specified as triggers has been fired */
    handle(event: IWatchableEvent, path: string): Promise<void> | void;
    /** Types of events the watcher should react to */
    triggers?(): IWatchableEvent[];
    /** Indicates whether the process should continue to run as long as files are being watched. */
    persistent?(): boolean;
    /**
     * (default: true).
     * When false, only the symlinks themselves will be watched for changes
     * instead of following the link references and bubbling events through the link's path
     */
    followSymlinks?(): boolean;
    /**
     * Whether to use fs.watchFile (backed by polling), or fs.watch.
     * If polling leads to high CPU utilization, consider setting this to false.
     * It is typically necessary to set this to true to successfully watch files over a network,
     * and it may be necessary to successfully watch files in other non-standard situations.
     * Setting to true explicitly on MacOS overrides the useFsEvents default
     * You may also set the CHOKIDAR_USEPOLLING env variable to true (1) or false (0) in order to override this option.
     */
    usePolling?(): IUsePollingOptions;

    /** Acts as a filter for ignoring certain paths */
    ignore?(): IIgnore;
}
