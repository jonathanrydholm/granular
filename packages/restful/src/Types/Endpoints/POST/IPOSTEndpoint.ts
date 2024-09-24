import { IResponse } from '../../Responses';
import { IEndpoint } from '../IEndpoint';
import { IPOSTRequest } from './IPOSTRequest';

export interface IPOSTEndpoint<TRequestBody>
    extends IEndpoint<IPOSTRequest<TRequestBody>> {
    handle(req: IPOSTRequest<TRequestBody>): Promise<IResponse<unknown>>;
}
