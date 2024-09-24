import { ILogger } from './ILogger';

export type ILoggerFactory = (name: string) => ILogger;
