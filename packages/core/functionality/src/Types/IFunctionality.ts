import { Container } from '@granular/injection';
import { ILogicExtension } from './ILogicExtension';

export interface IFunctionality<TClass, TIdentifiers, TConfiguration = never> {
    /** Method for extending logic */
    onLogicExtensions(
        extensions: ILogicExtension<TClass, TIdentifiers>[],
        container: Container
    ): void;
    /** Method for configuring the functionality */
    onConfigure(
        configuration: TConfiguration,
        container: Container
    ): void | Promise<void>;
    /** Lifecycle method for binding internal logic needed for this functionality. */
    bindInternals(container: Container): void | Promise<void>;
    postBindInternals?(container: Container): void | Promise<void>;
    start(container: Container): Promise<void>;
}
