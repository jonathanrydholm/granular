import { IUnknownGraphQLResolver } from './IGraphQLResolver';

export interface IGraphQLTypeResolver<TType> {
    attribute: keyof TType;
    resolver: IUnknownGraphQLResolver;
}
