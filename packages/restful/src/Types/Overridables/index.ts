import { IServerConfiguration } from '../Configuration';
import { IEndpoint } from '../Endpoints';
import {
    IRequestExceptionHandler,
    IRequestHandler,
    IResponseHandler,
    IServer,
} from '../Server';

export enum RestfulIdentifiers {
    SERVER_CONFIGURATION = 'IServerConfiguration',
    SERVER = 'IServer',
    ENDPOINT = 'IEndpoint',
    REQUEST_HANDLER = 'IRequestHandler',
    REQUEST_EXCEPTION_HANDLER = 'IRequestExceptionHandler',
    RESPONSE_HANDLER = 'IResponseHandler',
}

export type Overridables =
    | IServerConfiguration
    | IServer
    | IEndpoint<unknown>
    | IRequestExceptionHandler
    | IResponseHandler
    | IRequestHandler;
