import { Container, IFunctionality, ILogicExtension } from '@granular/system';
import { injectable } from 'inversify';
import {
    IApollo,
    IGraphQLIdentifiers,
    IGraphQLOverrides,
    IGraphQLSchemaManager,
} from './Types';
import { HttpServerIdentifiers, IHttpRequestHandler } from '@granular/http';
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
        extensions: ILogicExtension<
            IGraphQLOverrides,
            IGraphQLIdentifiers,
            never
        >[],
        container: Container
    ): void {
        extensions.forEach((extension) => {
            if (
                extension.identifier === IGraphQLIdentifiers.QUERY_RESOLVER ||
                extension.identifier === IGraphQLIdentifiers.OUTPUT_TYPE ||
                extension.identifier === IGraphQLIdentifiers.INPUT_TYPE
            ) {
                extension.definitions.forEach((definition) => {
                    container
                        .bind(extension.identifier)
                        .to(definition)
                        .inSingletonScope();
                });
            }
        });
    }

    onConfigure(configuration: never): void {}

    bindInternals(container: Container): void {
        container
            .bind<IHttpRequestHandler>(HttpServerIdentifiers.REQUEST_HANDLER)
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
    }

    async start(container: Container): Promise<void> {
        container.get<IGraphQLSchemaManager>('IGraphQLSchemaManager').build();
        await container.get<IApollo>('IGraphQLApolloServer').start();
    }
}
