import { inject, injectable, multiInject, optional } from '@granular/system';
import { createServer, Server } from 'node:http';
import {
    IHttpRequestHandler,
    IHttpServer,
    IHttpServerConfiguration,
} from '../Types';
import { ILogger, ILoggerFactory } from '@granular/logger';

@injectable()
export class HttpServer implements IHttpServer {
    private server: Server;
    private logger: ILogger;

    constructor(
        @multiInject('IHttpRequestHandler')
        @optional()
        private requestHandlers: IHttpRequestHandler[],
        @inject('ILoggerFactory') loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory({ name: 'HttpServer' });
    }

    configure(): void {
        this.server = createServer();

        this.server.addListener('request', (request, response) => {
            const headers = {
                'Access-Control-Allow-Origin':
                    '*' /* @dev First, read about security */,
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Max-Age': 2592000, // 30 days
                /** add other headers as per requirement */
            };

            if (request.method === 'OPTIONS') {
                response.writeHead(204, headers);
                response.end();
                return;
            }
            this.logger
                .get()
                .trace(
                    `Received request, method: ${request.method}, path: ${request.url}`
                );
            const matchingHandler = this.requestHandlers.find((handler) =>
                handler.getMethod() !== 'all'
                    ? handler.getMethod() === request.method
                    : true && request.url?.endsWith(handler.getPath())
            );

            if (matchingHandler) {
                this.logger
                    .get()
                    .trace(
                        `Found matching handler ${matchingHandler.getPath()}`
                    );
                matchingHandler.handle(request, response);
            } else {
                response.writeHead(404).end();
            }
        });
    }

    start({ port }: IHttpServerConfiguration): Promise<void> {
        this.logger.get().info('Starting http server');
        return new Promise<void>((resolve) => {
            this.server.listen(port, resolve);
        });
    }
}
