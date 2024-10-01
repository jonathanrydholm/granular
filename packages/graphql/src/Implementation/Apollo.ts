import { ApolloServer } from '@apollo/server';
import { inject, injectable, multiInject, optional } from '@granular/system';
import { IApollo, IGraphQLIdentifiers, IGraphQLSchemaManager } from '../Types';
import { IUnknownGraphQLResolver } from '../Types/IGraphQLResolver';

@injectable()
export class Apollo implements IApollo {
    private apolloServer: ApolloServer<unknown>;

    constructor(
        @inject('IGraphQLSchemaManager')
        private schemaManager: IGraphQLSchemaManager,
        @multiInject(`${IGraphQLIdentifiers.QUERY_RESOLVER}_internal`)
        @optional()
        private queryResolvers: IUnknownGraphQLResolver[]
    ) {}

    getServer(): ApolloServer<unknown> {
        return this.apolloServer;
    }

    async start(): Promise<void> {
        this.apolloServer = new ApolloServer<unknown>({
            typeDefs: this.schemaManager.getSchema(),
            introspection: true,
            resolvers: {
                Query: {
                    ...this.queryResolvers.reduce(
                        (acc, curr) => ({
                            ...acc,
                            [curr.constructor.name]: (a, b, c) => {
                                return curr.handle(a, b.input, c);
                            },
                        }),
                        {}
                    ),
                },
            },
        });
        await this.apolloServer.start();
    }
}
