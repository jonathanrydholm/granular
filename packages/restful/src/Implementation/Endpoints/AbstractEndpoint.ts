import { injectable } from '@granular/application';
import { IEndpoint, IEndpointType, IResponse } from '../../Types';

@injectable()
export abstract class AbstractEndpoint<TRequest>
    implements IEndpoint<TRequest>
{
    abstract getRoute(): string;
    abstract handle(req: TRequest): Promise<IResponse<unknown>>;
    abstract getType(): IEndpointType;
}
