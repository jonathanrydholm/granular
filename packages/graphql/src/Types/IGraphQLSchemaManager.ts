import { GraphQLSchema } from 'graphql';

export interface IGraphQLSchemaManager {
    build(): void;
    getSchema(): GraphQLSchema;
}
