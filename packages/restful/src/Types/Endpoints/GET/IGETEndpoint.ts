import { IResponse } from '../../Responses';
import { IEndpoint } from '../IEndpoint';
import { IGETRequest } from './IGETRequest';

export interface IGETEndpoint extends IEndpoint<IGETRequest> {
    handle(req: IGETRequest): Promise<IResponse<unknown>>;
}
