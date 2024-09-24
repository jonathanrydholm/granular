import { IResponse } from '../Responses';
import { IEndpointType } from './IEndpointType';

export interface IEndpoint<TRequest> {
    getType(): IEndpointType;
    getRoute(): string;
    handle(req: TRequest): Promise<IResponse<unknown>>;
}
