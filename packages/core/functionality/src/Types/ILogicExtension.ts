import { IClassDefinition } from './IClassDefinition';

export interface ILogicExtension<T, KIdentifier> {
    definitions: IClassDefinition<T>[];
    identifier: KIdentifier;
}
