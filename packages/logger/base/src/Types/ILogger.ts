import { ILoggerConfiguration } from './ILoggerConfiguration';

export interface ILogger {
    init(configuration: ILoggerConfiguration): void;
    trace(msg: string): void;
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string, ...args: any[]): void;
}
