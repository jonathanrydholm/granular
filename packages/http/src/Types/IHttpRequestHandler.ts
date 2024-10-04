import type { FastifyRequest, FastifyReply } from 'fastify';

export interface IHttpRequestHandler<TResponse> {
    handle(req: FastifyRequest, res: FastifyReply): Promise<TResponse>;
    getPath(): string;
    getMethod(): 'post' | 'get' | 'delete' | 'put' | 'patch' | 'all';
}
