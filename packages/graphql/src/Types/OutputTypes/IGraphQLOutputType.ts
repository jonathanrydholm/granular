import { UnknownClassDefinition } from '@granular/system';
import { IUnknownGraphQLResolver } from '../IGraphQLResolver';

export interface IGraphQLType<TDescription> {
    getType(): IGraphQLTypeDescription<TDescription>;
}

export type IGraphQLTypeDescription<TDescription> =
    | string
    | Record<
          keyof TDescription,
          | string
          | UnknownClassDefinition
          | UnknownClassDefinition[]
          | IGraphQLTypeDescriptionResolver
      >;

export interface IGraphQLTypeDescriptionResolver {
    resolver: IUnknownGraphQLResolver;
    type: string | UnknownClassDefinition | UnknownClassDefinition[];
}

export type IUnknownGraphQLType = IGraphQLType<unknown>;
