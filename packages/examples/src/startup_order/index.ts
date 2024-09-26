import {
    System,
    IApplication,
    inject,
    injectable,
    WithFunctionality,
    WithStartupPriority,
    WithIdentifier,
} from '@granular/application';
import { GranularLogger, ILogger, ILoggerFactory } from '@granular/logger';
import {
    GranularWatcher,
    IWatchableEvent,
    IWatcher,
    Triggers,
    WatcherIdentifiers,
} from '@granular/watcher';
import { join } from 'path';

@injectable()
@Triggers(['change', 'add', 'addDir', 'unlink', 'unlinkDir'])
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
@Triggers(['change', 'add', 'addDir', 'unlink', 'unlinkDir'])
class WatchOtherFile implements IWatcher {
    private logger: ILogger;

    constructor(@inject('ILoggerFactory') loggerFactory: ILoggerFactory) {
        this.logger = loggerFactory({ name: 'WatchOtherFile' });
    }

    glob(): string {
        return join(__dirname, '../', '../', '../', 'otherfile');
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
@WithStartupPriority(0)
@WithIdentifier('A')
class ApplicationA implements IApplication {}

@injectable()
@WithFunctionality({
    functionality: GranularWatcher,
    extend: [
        {
            identifier: WatcherIdentifiers.WATCHER,
            definitions: [WatchOtherFile],
        },
    ],
})
@WithStartupPriority(1)
@WithIdentifier('B')
class ApplicationB implements IApplication {}

new System()
    .withApplications([ApplicationA, ApplicationB])
    .start()
    .then(() => {
        console.log('Application running');
    });
