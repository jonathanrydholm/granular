import { UnknownClassDefinition } from '@granular/system';
import { IGraphQLResolver, IGraphQLTypeResolver } from '../Types';

export interface IInternalGraphqlResolver<
    TOutputType,
    TInputType = never,
    TContext = never,
    TParent = never,
> extends IGraphQLResolver<TOutputType, TInputType, TContext, TParent> {
    getOutputType?(): UnknownClassDefinition | string;
    getInputType?(): UnknownClassDefinition | string;
    getTypeResolvers?(): IGraphQLTypeResolver<TOutputType>[];
}
