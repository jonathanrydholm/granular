import {
    IClassDefinition,
    IWithFunctionalityOptions,
} from '@granular/functionality';
import { IApplication } from '../../Types';

/** Adds functionality to an application */
export function WithFunctionality<TClass, TLogicIdentifier, TConfiguration>(
    options: IWithFunctionalityOptions<TClass, TLogicIdentifier, TConfiguration>
) {
    return function (target: IClassDefinition<IApplication>) {
        if (!target.prototype._granular_functionalities) {
            target.prototype._granular_functionalities = [];
        }
        target.prototype._granular_functionalities.push(options);
    };
}
