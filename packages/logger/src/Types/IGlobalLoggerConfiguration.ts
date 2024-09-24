import type { LoggerOptions } from 'pino';
import type { PrettyOptions } from 'pino-pretty';

export interface IGlobalLoggerConfiguration {
    identifier: string;
    pino?: LoggerOptions;
    prettyOptions?: PrettyOptions;
}
