import { GraphQLSchema } from 'graphql';
import { IUnknownGraphQLResolver } from './IGraphQLResolver';

export interface IGraphQLSchemaManager {
    build(): void;
    getSchema(): GraphQLSchema;
    getTypeResolvers(): Record<string, Record<string, IUnknownGraphQLResolver>>;
}
