import { Container } from '../Implementation';
import { ILogicExtension } from './Logic';

export interface IFunctionality<TClass, TIdentifiers, TConfiguration = never> {
    onLogicExtensions(
        extensions: ILogicExtension<TClass, TIdentifiers, TConfiguration>[],
        container: Container
    ): void;
    onConfigure(
        configuration: TConfiguration,
        container: Container
    ): void | Promise<void>;
    bindInternals(container: Container): void | Promise<void>;
    start(container: Container): Promise<void>;
}
