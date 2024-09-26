import {
    System,
    IApplication,
    inject,
    injectable,
    WithFunctionality,
} from '@granular/application';
import { ILogger, ILoggerFactory } from '@granular/logger';
import {
    FollowSymlinks,
    GranularWatcher,
    Ignore,
    IWatchableEvent,
    IWatcher,
    Persistent,
    Triggers,
    UsePolling,
    WatcherIdentifiers,
} from '@granular/watcher';
import { join } from 'path';

@injectable()
@Persistent(true)
@Triggers(['change', 'add', 'addDir', 'unlink', 'unlinkDir'])
@UsePolling({ binaryInterval: 5, interval: 1 })
@Ignore((path) => path.includes('.txt'))
@FollowSymlinks(() => true)
class WatchReadMe implements IWatcher {
    private logger: ILogger;

    constructor(@inject('ILoggerFactory') loggerFactory: ILoggerFactory) {
        this.logger = loggerFactory({ name: 'WatchReadMe' });
    }

    glob(): string {
        return join(__dirname, '../', '../', '../', 'README.md');
    }

    handle(event: IWatchableEvent, path: string): Promise<void> | void {
        this.logger.get().info(`${path} - ${event}`);
    }
}

@injectable()
@WithFunctionality({
    functionality: GranularWatcher,
    extend: [
        {
            identifier: WatcherIdentifiers.WATCHER,
            definitions: [WatchReadMe],
        },
    ],
})
class Application implements IApplication {}

new System()
    .withApplications([Application])
    .start()
    .then(() => {
        console.log('Application running');
    });
