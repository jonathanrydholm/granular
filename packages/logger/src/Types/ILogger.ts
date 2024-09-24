import { IBaseLogger } from './IBaseLogger';
import type { Logger } from 'pino';

export interface ILogger extends IBaseLogger {
    set(logger: Logger<never, boolean>): void;
}
