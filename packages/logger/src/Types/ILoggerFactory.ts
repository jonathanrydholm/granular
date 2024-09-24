import { ILogger } from './ILogger';
import { ILoggerConfiguration } from './ILoggerConfiguration';

export type ILoggerFactory = (configuration: ILoggerConfiguration) => ILogger;
