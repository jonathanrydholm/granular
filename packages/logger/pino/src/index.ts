import { injectable } from '@granular/injection';
import { ILogger, ILoggerConfiguration } from '@granular/logger';
import pino from 'pino';
import type { Logger } from 'pino';

@injectable()
export class PinoLogger implements ILogger {
    private logger: Logger;

    init(configuration: ILoggerConfiguration): void {
        this.logger = pino({
            level: configuration.level,
            name: configuration.name,
        });
    }

    trace(msg: string): void {
        this.logger.trace(msg);
    }

    info(msg: string): void {
        this.logger.info(msg);
    }

    warn(msg: string): void {
        this.logger.warn(msg);
    }

    error(msg: string): void {
        this.logger.error(msg);
    }
}
