import { IHttpRequestHandler } from '@granular/http';
import { inject, injectable } from '@granular/system';
import { IncomingMessage, ServerResponse } from 'http';
import { IApollo } from '../Types';
import { HeaderMap, HTTPGraphQLRequest } from '@apollo/server';
import { parse } from 'url';

@injectable()
export class GraphqlRequestHandler implements IHttpRequestHandler {
    constructor(@inject('IGraphQLApolloServer') private apollo: IApollo) {}

    async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
        const rawBody = await new Promise<string>((resolve) => {
            const bodyParts = [];
            req.on('data', (chunk) => {
                bodyParts.push(chunk);
            }).on('end', () => {
                resolve(Buffer.concat(bodyParts).toString());
            });
        });

        const body = rawBody ? JSON.parse(rawBody) : undefined;

        const headers = new HeaderMap();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) {
                headers.set(
                    key,
                    Array.isArray(value) ? value.join(', ') : value
                );
            }
        }

        const httpGraphQLRequest: HTTPGraphQLRequest = {
            method: req.method.toUpperCase(),
            headers,
            search: parse(req.url).search ?? '',
            body,
        };

        const httpGraphQLResponse = await this.apollo
            .getServer()
            .executeHTTPGraphQLRequest({
                httpGraphQLRequest,
                context: async () => ({}),
            });

        for (const [key, value] of httpGraphQLResponse.headers) {
            res.setHeader(key, value);
        }

        res.writeHead(httpGraphQLResponse.status || 200);

        if (httpGraphQLResponse.body.kind === 'complete') {
            res.write(httpGraphQLResponse.body.string);
            res.end();
            return;
        }

        for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
            res.write(chunk);
            if (typeof (res as any).flush === 'function') {
                (res as any).flush();
            }
        }
        res.end();
    }

    getPath(): string {
        return '/graphql';
    }

    getMethod(): 'post' | 'get' | 'delete' | 'put' | 'patch' | 'all' {
        return 'all';
    }
}
