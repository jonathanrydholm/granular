import {
    Container,
    IFunctionality,
    ILogicExtension,
    injectable,
} from '@granular/system';

@injectable()
export class GranularGraphql implements IFunctionality<null, null> {
    onLogicExtensions(
        extensions: ILogicExtension<null, null, never>[],
        container: Container
    ): void {}

    onConfigure(configuration: never): void {}

    bindInternals(container: Container): void {
        // container
        //     .bind<IApollo>('IGraphQLApolloServer')
        //     .to(Apollo)
        //     .inSingletonScope();
    }

    async start(container: Container): Promise<void> {
        // container.get<IGraphQLSchemaManager>('IGraphQLSchemaManager').build();
        // await container.get<IApollo>('IGraphQLApolloServer').start();
    }
}
