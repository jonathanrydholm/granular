import { ILogLevel } from './ILogLevel';

export interface ILoggerConfiguration {
    name: string;
    level?: ILogLevel;
}
