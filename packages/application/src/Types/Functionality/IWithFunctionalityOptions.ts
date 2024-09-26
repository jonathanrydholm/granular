import { IClassDefinition } from '../ClassDefinition';
import { ILogicExtension } from '../Logic';
import { IFunctionality } from './IFunctionality';

export interface IWithFunctionalityOptions<
    TClass,
    TLogicIdentifier,
    TConfiguration,
> {
    /** Configuration for functionality */
    configure?: TConfiguration;
    /** Class definition of the functionality */
    functionality: IClassDefinition<
        IFunctionality<TClass, TLogicIdentifier, TConfiguration>,
        TConfiguration
    >;
    /** Logic extensions of functionality */
    extend?: ILogicExtension<TClass, TLogicIdentifier, TConfiguration>[];
}
