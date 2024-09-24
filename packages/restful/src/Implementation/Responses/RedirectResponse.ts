import { IResponse, IResponseType } from '../../Types';
import { AbstractResponse } from './AbstractResponse';

export class RedirectResponse
    extends AbstractResponse<string>
    implements IResponse<string>
{
    getType(): IResponseType {
        return 'redirect';
    }
}
