import { UnknownClassDefinition } from '@granular/system';
import { IGraphQLType } from './OutputTypes';

export interface IGraphQLResolver<
    TOutputType,
    TInputType = never,
    TContext = never,
    TParent = never,
> {
    getOutputType(): UnknownClassDefinition | string;
    getInputType?(): UnknownClassDefinition | string;
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
