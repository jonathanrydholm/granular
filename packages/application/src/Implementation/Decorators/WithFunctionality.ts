import {
    IApplication,
    IClassDefinition,
    IWithFunctionalityOptions,
} from '../../Types';

/** Adds functionality to an application */
export function WithFunctionality<TClass, TLogicIdentifier, TConfiguration>(
    options: IWithFunctionalityOptions<TClass, TLogicIdentifier, TConfiguration>
) {
    return function (target: IClassDefinition<IApplication, TConfiguration>) {
        if (!target.prototype._granular_functionalities) {
            target.prototype._granular_functionalities = [];
        }
        target.prototype._granular_functionalities.push(options);
    };
}
