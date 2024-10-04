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
        @multiInject(IGraphQLIdentifiers.QUERY_RESOLVER)
        @optional()
        private queryResolvers: IUnknownGraphQLResolver[],
        @multiInject(IGraphQLIdentifiers.MUTATION_RESOLVER)
        @optional()
        private mutationResolvers: IUnknownGraphQLResolver[]
    ) {}

    getServer(): ApolloServer<unknown> {
        return this.apolloServer;
    }

    async start(): Promise<void> {
        this.apolloServer = new ApolloServer<unknown>({
            typeDefs: this.schemaManager.getSchema(),
            introspection: true,
            resolvers: {
                ...Object.entries(this.schemaManager.getTypeResolvers()).reduce(
                    (acc, [type, attributeResolvers]) => {
                        return {
                            ...acc,
                            [type]: Object.entries(attributeResolvers).reduce(
                                (attributes, [attribute, resolver]) => ({
                                    ...attributes,
                                    [attribute]: (a, b, c) => {
                                        // TODO, handle intercepts here
                                        return resolver.handle(a, b.input, c);
                                    },
                                }),
                                {}
                            ),
                        };
                    },
                    {}
                ),

                ...(this.queryResolvers.length > 0
                    ? {
                          Query: {
                              ...this.queryResolvers.reduce(
                                  (acc, curr) => ({
                                      ...acc,
                                      [curr.constructor.name]: (a, b, c) => {
                                          // TODO, handle intercepts here
                                          return curr.handle(a, b.input, c);
                                      },
                                  }),
                                  {}
                              ),
                          },
                      }
                    : {}),

                ...(this.mutationResolvers.length > 0
                    ? {
                          Mutation: {
                              ...this.mutationResolvers.reduce(
                                  (acc, curr) => ({
                                      ...acc,
                                      [curr.constructor.name]: (a, b, c) => {
                                          // TODO, handle intercepts here
                                          return curr.handle(a, b.input, c);
                                      },
                                  }),
                                  {}
                              ),
                          },
                      }
                    : {}),
            },
        });
        await this.apolloServer.start();
    }
}
