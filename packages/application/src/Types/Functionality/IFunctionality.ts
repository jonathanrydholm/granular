import { Container } from '../../Implementation';
import { ILogicExtension } from '../Logic';

export interface IFunctionality<TClass, TIdentifiers, TConfiguration = never> {
    /** Method for extending logic */
    onLogicExtensions(
        extensions: ILogicExtension<TClass, TIdentifiers, TConfiguration>[],
        container: Container
    ): void;
    onConfigure(
        configuration: TConfiguration,
        container: Container
    ): void | Promise<void>;
    /** Lifecycle method for binding internal logic needed for this functionality. */
    bindInternals(container: Container): void | Promise<void>;
    start(container: Container): Promise<void>;
}
