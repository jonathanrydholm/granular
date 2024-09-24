import { inject, injectable } from '@granular/application';
import type { Request, Response } from 'express';
import {
    IEndpoint,
    IRequestExceptionHandler,
    IRequestHandler,
    IResponseHandler,
    RestfulIdentifiers,
} from '../../Types';
import { ILoggerFactory } from '@granular/logger';

@injectable()
export class RequestHandler implements IRequestHandler {
    constructor(
        @inject(RestfulIdentifiers.RESPONSE_HANDLER)
        private responseHandler: IResponseHandler,
        @inject(RestfulIdentifiers.REQUEST_EXCEPTION_HANDLER)
        private exceptionHandler: IRequestExceptionHandler,
        @inject('ILoggerFactory') private loggerFactory: ILoggerFactory
    ) {}

    async handle(
        req: Request,
        res: Response,
        endpoint: IEndpoint<unknown>
    ): Promise<void> {
        const logger = this.loggerFactory({ name: 'RequestHandler' });
        logger.get().trace('Received request');
        try {
            const handledResponse = await endpoint.handle(req);
            await this.responseHandler.handle(handledResponse, res);
        } catch (e) {
            await this.exceptionHandler.handle(e, res);
        }
    }
}
