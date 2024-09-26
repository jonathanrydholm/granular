import * as cors from 'cors';
import type { Express } from 'express';
import * as express from 'express';
import {
    IRequestHandlerFactory,
    RestfulIdentifiers,
    type IEndpoint,
    type IServer,
    type IServerConfiguration,
} from '../../Types';
import { inject, injectable, multiInject, optional } from '@granular/system';
import { ILogger, ILoggerFactory } from '@granular/logger';

@injectable()
export class Server implements IServer {
    private app: Express;
    private logger: ILogger;

    constructor(
        @multiInject(RestfulIdentifiers.ENDPOINT)
        @optional()
        private endpoints: IEndpoint<unknown>[],
        @inject(RestfulIdentifiers.SERVER_CONFIGURATION)
        private serverConfiguration: IServerConfiguration,
        @inject('ILoggerFactory') loggerFactory: ILoggerFactory,
        @inject('IRequestHandlerFactory')
        private requestHandlerFactory: IRequestHandlerFactory
    ) {
        this.logger = loggerFactory({
            name: 'GranularService',
        });
        this.app = this.serverConfiguration.getExpress() || express();
    }

    getApp(): Express {
        return this.app;
    }

    configure(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.logger.get().info('Configuring endpoints');
        this.endpoints.forEach((endpoint) => {
            this.logger
                .get()
                .info(
                    `Binding endpoint ${endpoint.getRoute()} as type ${endpoint.getType().toUpperCase()}`
                );
            switch (endpoint.getType()) {
                case 'get': {
                    this.app.get(endpoint.getRoute(), async (_req, _res) => {
                        await this.requestHandlerFactory().handle(
                            _req,
                            _res,
                            endpoint
                        );
                    });
                    break;
                }
                case 'post': {
                    this.app.post(endpoint.getRoute(), async (_req, _res) => {
                        await this.requestHandlerFactory().handle(
                            _req,
                            _res,
                            endpoint
                        );
                    });
                    break;
                }
            }
        });
    }

    start(): Promise<void> {
        return new Promise<void>((resolve) => {
            const port = this.serverConfiguration.getPort();
            this.logger.get().info(`Starting server on port ${port}`);
            this.app.listen(port, resolve);
        }).finally(() => {
            this.logger.get().info('Server started');
        });
    }
}
