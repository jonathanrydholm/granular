import {
    System,
    IApplication,
    inject,
    injectable,
    WithFunctionality,
} from '@granular/system';
import { ILogger, ILoggerFactory } from '@granular/logger';
import {
    GranularWatcher,
    IWatchableEvent,
    IWatcher,
    Triggers,
    WatcherIdentifiers,
} from '@granular/watcher';
import { join } from 'path';
import { PinoLogger } from '@granular/logger-pino';

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
        this.logger.info(`${path} - ${event}`);
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
    .start(PinoLogger)
    .then(() => {
        console.log('Application running');
    });
