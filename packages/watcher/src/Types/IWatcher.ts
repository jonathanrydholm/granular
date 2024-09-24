import { IWatchableEvent } from './IWatchableEvent';

export interface IWatcher {
    glob(): string;
    handle(event: IWatchableEvent, path: string): Promise<void> | void;
    triggers?(): IWatchableEvent[];
    persistent?(): boolean;
    followSymlinks?(): boolean;
    usePolling?(): boolean;
}
