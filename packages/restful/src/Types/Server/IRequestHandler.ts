import { IEndpoint } from '../Endpoints';
import type { Request, Response } from 'express';

export interface IRequestHandler {
    handle(
        request: Request,
        response: Response,
        endpoint: IEndpoint<unknown>
    ): Promise<void>;

    setTraceId(traceId: string): void;
}
