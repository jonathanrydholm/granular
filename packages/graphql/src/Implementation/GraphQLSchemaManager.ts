import { buildSchema, GraphQLSchema } from 'graphql';
import {
    IGraphQLIdentifiers,
    IGraphQLSchemaManager,
    IGraphQLTypeDescriptionResolver,
    IUnknownGraphQLResolver,
    IUnknownGraphQLType,
} from '../Types';
import { injectable, multiInject, optional } from '@granular/system';
import { IUnknownInternalGraphQLResolver } from '../InternalTypes';

@injectable()
export class GraphQLSchemaManager implements IGraphQLSchemaManager {
    private schema: GraphQLSchema;
    private typeResolvers: Record<
        string,
        Record<string, IUnknownGraphQLResolver>
    >;

    constructor(
        @multiInject(IGraphQLIdentifiers.QUERY_RESOLVER)
        @optional()
        private queryResolvers: IUnknownInternalGraphQLResolver[],
        @multiInject(IGraphQLIdentifiers.INPUT_TYPE)
        @optional()
        private inputTypes: IUnknownGraphQLType[],
        @multiInject(IGraphQLIdentifiers.OUTPUT_TYPE)
        @optional()
        private outputTypes: IUnknownGraphQLType[],
        @multiInject(IGraphQLIdentifiers.MUTATION_RESOLVER)
        @optional()
        private mutationResolvers: IUnknownInternalGraphQLResolver[]
    ) {
        this.typeResolvers = {};
    }

    getTypeResolvers(): Record<
        string,
        Record<string, IUnknownGraphQLResolver>
    > {
        return this.typeResolvers;
    }

    build(): void {
        const inputTypes = this.inputTypes
            .map((inputType) => {
                const description = inputType.getType();
                if (typeof description === 'object') {
                    if (Array.isArray(description)) {
                        return `
                        input ${inputType.constructor.name} {
                            ${Object.entries(description[0])
                                .map(([property, type]) => {
                                    if (typeof type === 'function') {
                                        if (Array.isArray(type)) {
                                            return `${property}: [${type.name}]`;
                                        }
                                        return `${property}: ${type.name}`;
                                    }
                                    return `${property}: ${type}`;
                                })
                                .join('\n')}
                        }
                    `;
                    } else {
                        return `
                        input ${inputType.constructor.name} {
                             ${Object.entries(description)
                                 .map(([property, type]) => {
                                     if (typeof type === 'function') {
                                         if (Array.isArray(type)) {
                                             return `${property}: [${type.name}]`;
                                         }
                                         return `${property}: ${type.name}`;
                                     }
                                     return `${property}: ${type}`;
                                 })
                                 .join('\n')}
                        }
                    `;
                    }
                }
            })
            .join('\n');

        const outputTypes = this.outputTypes
            .map((outputType) => {
                const description = outputType.getType();
                if (typeof description === 'object') {
                    if (Array.isArray(description)) {
                        return `
                        type ${outputType.constructor.name} {
                            ${Object.entries(description[0])
                                .map(([property, type]) => {
                                    if (typeof type === 'function') {
                                        if (Array.isArray(type)) {
                                            return `${property}: [${type.name}]`;
                                        }
                                        return `${property}: ${type.name}`;
                                    }
                                    return `${property}: ${type}`;
                                })
                                .join('\n')}
                        }
                    `;
                    } else {
                        return `
                        type ${outputType.constructor.name} {
                             ${Object.entries(description)
                                 .map(([property, type]) => {
                                     if (typeof type === 'function') {
                                         if (Array.isArray(type)) {
                                             return `${property}: [${type.name}]`;
                                         }
                                         return `${property}: ${type.name}`;
                                     } else if (typeof type === 'object') {
                                         const resolverType =
                                             type as IGraphQLTypeDescriptionResolver;
                                         if (resolverType.resolver) {
                                             if (
                                                 typeof resolverType.type ===
                                                 'function'
                                             ) {
                                                 if (
                                                     !this.typeResolvers[
                                                         outputType.constructor
                                                             .name
                                                     ]
                                                 ) {
                                                     this.typeResolvers[
                                                         outputType.constructor.name
                                                     ] = {
                                                         [property]:
                                                             resolverType.resolver,
                                                     };
                                                 }
                                                 return `${property}: ${resolverType.type.name}`;
                                             } else {
                                                 return `${property}: ${type}`;
                                             }
                                         }
                                     }
                                     return `${property}: ${type}`;
                                 })
                                 .join('\n')}
                        }
                    `;
                    }
                }
            })
            .join('\n');

        const queries = this.queryResolvers
            .map((resolver) => {
                const inputType = resolver.getInputType
                    ? resolver.getInputType()
                    : null;
                const outputType = resolver.getOutputType();
                const input = inputType
                    ? `(input: ${typeof inputType === 'function' ? inputType.name : inputType})`
                    : '';
                return `
                    ${resolver.constructor.name}${input}: ${typeof outputType === 'function' ? outputType.name : outputType}
                `;
            })
            .join('\n');

        const mutations = this.mutationResolvers
            .map((resolver) => {
                const inputType = resolver.getInputType
                    ? resolver.getInputType()
                    : null;
                const outputType = resolver.getOutputType();
                const input = inputType
                    ? `(input: ${typeof inputType === 'function' ? inputType.name : inputType})`
                    : '';
                return `
                    ${resolver.constructor.name}${input}: ${typeof outputType === 'function' ? outputType.name : outputType}
                `;
            })
            .join('\n');

        const schema = `
            ${inputTypes}
            ${outputTypes}
            ${
                queries
                    ? `
                type Query {
                    ${queries}
                }
            `
                    : ''
            }

            ${
                mutations
                    ? `
                type Mutation {
                    ${mutations}
                }
            `
                    : ''
            }
        `;

        this.schema = buildSchema(schema);
    }

    getSchema(): GraphQLSchema {
        return this.schema;
    }
}
