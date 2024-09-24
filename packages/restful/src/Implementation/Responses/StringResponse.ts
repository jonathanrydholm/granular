import { IResponse, IResponseType } from '../../Types';
import { AbstractResponse } from './AbstractResponse';

export class StringResponse
    extends AbstractResponse<string>
    implements IResponse<string>
{
    getType(): IResponseType {
        return 'string';
    }
}
