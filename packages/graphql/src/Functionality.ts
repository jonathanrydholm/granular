import { Container, Factory } from '@granular/system';
import { IFunctionality, ILogicExtension } from '@granular/functionality';
import { injectable } from 'inversify';
import {
    IApollo,
    IGraphQLContext,
    IGraphQLIdentifiers,
    IGraphQLOverrides,
    IGraphQLSchemaManager,
} from './Types';
import {
    FastifyReply,
    FastifyRequest,
    HttpServerIdentifiers,
    IHttpRequestHandler,
} from '@granular/http';
import {
    Apollo,
    GraphqlRequestHandler,
    GraphQLSchemaManager,
} from './Implementation';

@injectable()
export class GranularGraphql
    implements IFunctionality<IGraphQLOverrides, IGraphQLIdentifiers>
{
    onLogicExtensions(
        extensions: ILogicExtension<IGraphQLOverrides, IGraphQLIdentifiers>[],
        container: Container
    ): void {
        extensions.forEach((extension) => {
            if (
                extension.identifier === IGraphQLIdentifiers.QUERY_RESOLVER ||
                extension.identifier === IGraphQLIdentifiers.OUTPUT_TYPE ||
                extension.identifier === IGraphQLIdentifiers.INPUT_TYPE ||
                extension.identifier === IGraphQLIdentifiers.MUTATION_RESOLVER
            ) {
                extension.definitions.forEach((definition) => {
                    container
                        .bind(extension.identifier)
                        .to(definition)
                        .inSingletonScope();
                });
            } else if (extension.identifier === IGraphQLIdentifiers.CONTEXT) {
                extension.definitions.forEach((definition) => {
                    container
                        .bind(extension.identifier)
                        .to(definition)
                        .inRequestScope();
                });
            }
        });
    }

    onConfigure(configuration: never): void {}

    bindInternals(container: Container): void {
        container
            .bind<
                IHttpRequestHandler<unknown>
            >(HttpServerIdentifiers.REQUEST_HANDLER)
            .to(GraphqlRequestHandler)
            .inSingletonScope();
        container
            .bind<IGraphQLSchemaManager>('IGraphQLSchemaManager')
            .to(GraphQLSchemaManager)
            .inSingletonScope();
        container
            .bind<IApollo>('IGraphQLApolloServer')
            .to(Apollo)
            .inSingletonScope();
        container
            .bind<
                Factory<Promise<IGraphQLContext>>
            >(`Factory<${IGraphQLIdentifiers.CONTEXT}>`)
            .toFactory<
                Promise<IGraphQLContext>,
                [FastifyRequest, FastifyReply]
            >((context) => {
                return async (request, reply) => {
                    const ctx = context.container.get<IGraphQLContext>(
                        IGraphQLIdentifiers.CONTEXT
                    );
                    await ctx.onInitialize(request, reply);
                    return ctx;
                };
            });
    }

    async start(container: Container): Promise<void> {
        container.get<IGraphQLSchemaManager>('IGraphQLSchemaManager').build();
        await container.get<IApollo>('IGraphQLApolloServer').start();
    }
}
