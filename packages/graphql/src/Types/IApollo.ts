import { ApolloServer } from '@apollo/server';

export interface IApollo {
    getServer(): ApolloServer<unknown>;
    start(): Promise<void>;
}
