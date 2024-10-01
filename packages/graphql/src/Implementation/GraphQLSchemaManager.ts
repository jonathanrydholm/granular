import { buildSchema, GraphQLSchema } from 'graphql';
import {
    IGraphQLIdentifiers,
    IGraphQLSchemaManager,
    IUnknownGraphQLType,
} from '../Types';
import { injectable, multiInject, optional } from '@granular/system';
import { IUnknownGraphQLResolver } from '../Types/IGraphQLResolver';

@injectable()
export class GraphQLSchemaManager implements IGraphQLSchemaManager {
    private schema: GraphQLSchema;

    constructor(
        @multiInject(`${IGraphQLIdentifiers.QUERY_RESOLVER}_internal`)
        @optional()
        private queryResolvers: IUnknownGraphQLResolver[],
        @multiInject(`${IGraphQLIdentifiers.INPUT_TYPE}_internal`)
        @optional()
        private inputTypes: IUnknownGraphQLType[],
        @multiInject(`${IGraphQLIdentifiers.OUTPUT_TYPE}_internal`)
        @optional()
        private outputTypes: IUnknownGraphQLType[]
    ) {}

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

        const schema = `
            ${inputTypes}
            ${outputTypes}
            type Query {
                ${queries}
                Ping: Boolean
            }
        `;

        this.schema = buildSchema(schema);
    }

    getSchema(): GraphQLSchema {
        return this.schema;
    }
}
