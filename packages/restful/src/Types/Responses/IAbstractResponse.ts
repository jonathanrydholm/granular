import { IResponseType } from './IResponseType';

export interface IAbstractResponse<TValue> {
    getType(): IResponseType;
    getValue(): TValue;
}
