import { AbstractEndpoint } from './AbstractEndpoint';
import type {
    IEndpointType,
    IGETEndpoint,
    IGETRequest,
    IResponse,
} from '../../Types';
import { injectable } from '@granular/system';

@injectable()
export abstract class GETEndpoint
    extends AbstractEndpoint<IGETRequest>
    implements IGETEndpoint
{
    abstract handle(req: IGETRequest): Promise<IResponse<unknown>>;

    getType(): IEndpointType {
        return 'get';
    }

    getRoute(): string {
        throw new Error('No route defined for endpoint');
    }
}
