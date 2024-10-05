import { UnknownClassDefinition } from '@granular/system';
import { IGraphQLResolver } from '../Types/IGraphQLResolver';
import { IGraphQLTypeResolver } from '../Types';

export function OutputType<TType = never>(
    type: UnknownClassDefinition | string,
    resolvers?: IGraphQLTypeResolver<TType>[]
) {
    return function (
        target: new (...args: any[]) => IGraphQLResolver<unknown, unknown>
    ) {
        target.prototype.getOutputType = function () {
            return type;
        };

        if (resolvers) {
            target.prototype.getTypeResolvers = function () {
                return resolvers;
            };
        }
    };
}
