import { inject, injectable, multiInject, optional } from '@granular/system';
import {
    IHttpRequestHandler,
    IHttpServer,
    IHttpServerConfiguration,
} from '../Types';
import { ILogger, ILoggerFactory } from '@granular/logger';
import Fastify, { FastifyInstance } from 'fastify';

@injectable()
export class HttpServer implements IHttpServer {
    private server: FastifyInstance;
    private logger: ILogger;

    constructor(
        @multiInject('IHttpRequestHandler')
        @optional()
        private requestHandlers: IHttpRequestHandler<unknown>[],
        @inject('ILoggerFactory') loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory({ name: 'HttpServer' });
    }

    configure(): void {
        const server = Fastify({
            logger: false,
        });

        this.requestHandlers.forEach((handler) => {
            if (handler.getMethod() === 'get') {
                server.get(handler.getPath(), (req, res) =>
                    handler.handle(req, res)
                );
            } else if (handler.getMethod() === 'post') {
                server.post(handler.getPath(), (req, res) =>
                    handler.handle(req, res)
                );
            } else if (handler.getMethod() === 'delete') {
                server.delete(handler.getPath(), (req, res) =>
                    handler.handle(req, res)
                );
            } else if (handler.getMethod() === 'patch') {
                server.patch(handler.getPath(), (req, res) =>
                    handler.handle(req, res)
                );
            } else if (handler.getMethod() === 'put') {
                server.put(handler.getPath(), (req, res) =>
                    handler.handle(req, res)
                );
            } else if (handler.getMethod() === 'all') {
                server.all(handler.getPath(), (req, res) =>
                    handler.handle(req, res)
                );
            }
        });
        this.server = server;
    }

    start({ port }: IHttpServerConfiguration): Promise<void> {
        this.logger.info('Starting http server');
        return new Promise<void>((resolve, reject) => {
            this.server.listen({ port }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
