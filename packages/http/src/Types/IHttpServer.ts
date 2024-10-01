import { IHttpServerConfiguration } from './IHttpServerConfiguration';

export interface IHttpServer {
    configure(): void;
    start(configuration: IHttpServerConfiguration): Promise<void>;
}
