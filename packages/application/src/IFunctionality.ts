import { Container } from './Container';
import { IFunctionalityDefinition } from './IFunctionalityDefinition';
import { IOverride } from './IOverride';

export interface IFunctionality<T, KIdentifier> {
    override(override: IOverride<T, KIdentifier>): void;
    getOverrides(): IOverride<T, KIdentifier>[];
    onOverride(overridables: IOverride<T, KIdentifier>, container: Container);
    register(container: Container): Promise<void> | void;
    configure(container: Container): Promise<void> | void;
    start(container: Container): Promise<void>;
}

export interface IApplication {
    addFunctionality<T, KIdentifier, UConfiguration>(
        granular: {
            Functionality: IFunctionalityDefinition<
                IFunctionality<T, KIdentifier>,
                UConfiguration
            >;
            configuration?: UConfiguration;
        },
        ...args: IOverride<T, KIdentifier>[]
    );
}
