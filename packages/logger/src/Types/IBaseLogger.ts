import type { Logger } from 'pino';

export interface IBaseLogger {
    get(): Logger<never, boolean>;
}
