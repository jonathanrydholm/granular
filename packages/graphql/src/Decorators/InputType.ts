import { UnknownClassDefinition } from '@granular/system';
import { IGraphQLResolver } from '../Types/IGraphQLResolver';

export function InputType(type: UnknownClassDefinition | string) {
    return function (
        target: new (...args: any[]) => IGraphQLResolver<unknown, unknown>
    ) {
        target.prototype.getInputType = function () {
            return type;
        };
    };
}
