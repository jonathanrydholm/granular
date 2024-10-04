import { IGraphQLContext } from './IGraphQLContext';
import { IUnknownGraphQLResolver } from './IGraphQLResolver';
import { IUnknownGraphQLType } from './OutputTypes';

export type IGraphQLOverrides =
    | IUnknownGraphQLResolver
    | IUnknownGraphQLType
    | IGraphQLContext;
