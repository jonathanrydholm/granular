import {
    inject,
    injectable,
    multiInject,
    optional,
} from '@granular/application';
import { ILogger, ILoggerFactory } from '@granular/logger';
import { IWatcher, IWatchManager, WatcherIdentifiers } from '../Types';
import { watch } from 'chokidar';

@injectable()
export class WatchManager implements IWatchManager {
    private logger: ILogger;

    constructor(
        @multiInject(WatcherIdentifiers.WATCHER)
        @optional()
        private watchers: IWatcher[],
        @inject('ILoggerFactory') loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory({ name: 'WatchManager' });
    }

    async start() {
        this.watchers.forEach((watcher) => {
            this.logger.get().info(`Creating watcher for ${watcher.glob()}`);
            const instance = watch(watcher.glob(), {
                persistent: watcher.persistent
                    ? watcher.persistent()
                    : undefined,
                followSymlinks: watcher.followSymlinks
                    ? watcher.followSymlinks()
                    : undefined,
                usePolling: watcher.usePolling
                    ? watcher.usePolling()
                    : undefined,
            });
            instance.on('ready', () => {
                this.logger.get().info(`Watching ${watcher.glob()}`);
                if (watcher.triggers) {
                    watcher.triggers().forEach((trigger) => {
                        instance.on(trigger, (path: string) => {
                            watcher.handle(trigger, path);
                        });
                    });
                } else {
                    this.logger
                        .get()
                        .warn(`No triggers defined for ${watcher.glob()}`);
                }
            });
            instance.on('error', (error) => {
                this.logger
                    .get()
                    .error(
                        `Received error while watching ${watcher.glob()}`,
                        error
                    );
            });
        });
    }
}
