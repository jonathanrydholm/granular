import { IClassDefinition } from '../ClassDefinition';

export interface ILogicExtension<T, KIdentifier, TConfiguration> {
    definitions: IClassDefinition<T>[];
    identifier: KIdentifier;
}
