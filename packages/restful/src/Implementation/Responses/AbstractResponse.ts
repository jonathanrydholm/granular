import { IAbstractResponse, IResponseType } from '../../Types';

export abstract class AbstractResponse<TValue>
    implements IAbstractResponse<TValue>
{
    private value: TValue;

    constructor(value: TValue) {
        this.value = value;
    }

    getValue(): TValue {
        return this.value;
    }

    abstract getType(): IResponseType;
}
