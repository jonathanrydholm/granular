import { IncomingMessage, ServerResponse } from 'http';

export interface IHttpRequestHandler {
    handle(req: IncomingMessage, res: ServerResponse): Promise<void>;
    getPath(): string;
    getMethod(): 'post' | 'get' | 'delete' | 'put' | 'patch' | 'all';
}
