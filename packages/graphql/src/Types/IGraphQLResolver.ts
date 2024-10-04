import { UnknownClassDefinition } from '@granular/system';

export interface IGraphQLResolver<
    TOutputType,
    TInputType = never,
    TContext = never,
    TParent = never,
> {
    handle(
        parent: TParent,
        input: TInputType,
        context: TContext
    ): Promise<TOutputType>;
}

export type IUnknownGraphQLResolver = IGraphQLResolver<
    unknown,
    unknown,
    unknown,
    unknown
>;
