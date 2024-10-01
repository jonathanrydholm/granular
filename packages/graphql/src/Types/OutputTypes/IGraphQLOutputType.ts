import { UnknownClassDefinition } from '@granular/system';

export interface IGraphQLType<TDescription> {
    getType(): IGraphQLTypeDescription<TDescription>;
}

export type IGraphQLTypeDescription<TDescription> =
    | string
    | Record<
          keyof TDescription,
          string | UnknownClassDefinition | UnknownClassDefinition[]
      >;

export type IUnknownGraphQLType = IGraphQLType<unknown>;
