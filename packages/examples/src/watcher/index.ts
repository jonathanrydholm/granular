import { Application, inject, injectable } from '@granular/application';
import { GranularLogger, ILogger, ILoggerFactory } from '@granular/logger';
import {
    GranularWatcher,
    IWatchableEvent,
    IWatcher,
    Persistent,
    Triggers,
    WatcherIdentifiers,
} from '@granular/watcher';
import { join } from 'path';

@injectable()
@Persistent(true)
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

new Application()
    .addFunctionality({
        Functionality: GranularLogger,
        configuration: {
            pino: { level: 'trace' },
            identifier: 'Application',
        },
    })
    .addFunctionality(
        { Functionality: GranularWatcher },
        {
            identifier: WatcherIdentifiers.WATCHER,
            logic: [WatchReadMe],
        }
    )
    .start()
    .then(() => {
        console.log('Application running');
    });
