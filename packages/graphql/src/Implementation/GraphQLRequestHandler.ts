import {
    FastifyReply,
    FastifyRequest,
    IHttpRequestHandler,
} from '@granular/http';
import { inject, injectable } from '@granular/system';
import { IApollo, IGraphQLContextFactory, IGraphQLIdentifiers } from '../Types';
import { HeaderMap, HTTPGraphQLRequest } from '@apollo/server';
import { parse } from 'url';

@injectable()
export class GraphqlRequestHandler implements IHttpRequestHandler<string> {
    constructor(
        @inject('IGraphQLApolloServer') private apollo: IApollo,
        @inject(`Factory<${IGraphQLIdentifiers.CONTEXT}>`)
        private contextFactory: IGraphQLContextFactory
    ) {}

    async handle(req: FastifyRequest, res: FastifyReply): Promise<string> {
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
            body: req.body,
        };

        const httpGraphQLResponse = await this.apollo
            .getServer()
            .executeHTTPGraphQLRequest({
                httpGraphQLRequest,
                context: () => this.contextFactory(req, res),
            });

        for (const [key, value] of httpGraphQLResponse.headers) {
            res.raw.setHeader(key, value);
        }

        res.code(200);

        if (httpGraphQLResponse.body.kind === 'complete') {
            return httpGraphQLResponse.body.string;
        }

        let output = '';
        for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
            output = output + chunk;
            if (typeof (res as any).flush === 'function') {
                (res as any).flush();
            }
        }
        return output;
    }

    getPath(): string {
        return '/graphql';
    }

    getMethod(): 'post' | 'get' | 'delete' | 'put' | 'patch' | 'all' {
        return 'all';
    }
}
