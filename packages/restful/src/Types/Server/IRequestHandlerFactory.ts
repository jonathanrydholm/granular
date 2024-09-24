import { IRequestHandler } from './IRequestHandler';

export type IRequestHandlerFactory = (traceId: string) => IRequestHandler;
