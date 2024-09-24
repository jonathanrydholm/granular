import type { ChildLoggerOptions } from 'pino';

export interface ILoggerConfiguration {
    name: string;
    pino?: ChildLoggerOptions;
}
