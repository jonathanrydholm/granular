import { IResponse, IResponseType } from '../../Types';
import { AbstractResponse } from './AbstractResponse';

export class JsonResponse<TSerializable>
    extends AbstractResponse<TSerializable>
    implements IResponse<TSerializable>
{
    getType(): IResponseType {
        return 'json';
    }
}
