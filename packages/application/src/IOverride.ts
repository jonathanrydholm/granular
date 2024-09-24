import { IFunctionalityDefinition } from './IFunctionalityDefinition';

export interface IOverride<T, KIdentifier> {
    logic: IFunctionalityDefinition<T, unknown>[];
    identifier: KIdentifier;
}
