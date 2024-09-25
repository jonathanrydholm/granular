import { IClassDefinition } from '../ClassDefinition';

export interface ILogicExtension<T, KIdentifier, TConfiguration> {
    definitions: IClassDefinition<T, TConfiguration>[];
    identifier: KIdentifier;
}
