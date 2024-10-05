import { injectable } from '@granular/injection';
import { ILogger, ILoggerConfiguration, ILogLevel } from '../Types';

@injectable()
export class Logger implements ILogger {
    private configuration: ILoggerConfiguration;

    private logLevelMap: Record<ILogLevel, number> = {
        trace: 0,
        info: 1,
        warn: 2,
        error: 3,
    };

    init(configuration: ILoggerConfiguration): void {
        this.configuration = configuration;
    }

    trace(msg: string): void {
        if (this.logLevelMap[this.configuration.level] === 0) {
            console.trace(this.configuration.name, msg);
        }
    }

    info(msg: string): void {
        if (this.logLevelMap[this.configuration.level] <= 1) {
            console.info(this.configuration.name, msg);
        }
    }

    warn(msg: string): void {
        if (this.logLevelMap[this.configuration.level] <= 2) {
            console.warn(this.configuration.name, msg);
        }
    }

    error(msg: string, ...args: any[]): void {
        if (this.logLevelMap[this.configuration.level] <= 3) {
            console.error(this.configuration.name, msg, args);
        }
    }
}
