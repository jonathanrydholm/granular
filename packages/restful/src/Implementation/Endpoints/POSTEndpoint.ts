import { AbstractEndpoint } from './AbstractEndpoint';
import {
    IEndpointType,
    IPOSTEndpoint,
    IPOSTRequest,
    IResponse,
} from '../../Types';
import { injectable } from '@granular/application';

@injectable()
export abstract class POSTEndpoint<TRequestBody>
    extends AbstractEndpoint<IPOSTRequest<TRequestBody>>
    implements IPOSTEndpoint<TRequestBody>
{
    abstract handle(
        req: IPOSTRequest<TRequestBody>
    ): Promise<IResponse<unknown>>;

    getType(): IEndpointType {
        return 'post';
    }
}
