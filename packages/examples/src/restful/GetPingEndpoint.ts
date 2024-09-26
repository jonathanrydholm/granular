import { injectable } from '@granular/system';
import {
    GETEndpoint,
    IGETRequest,
    IResponse,
    JsonResponse,
    Route,
} from '@granular/restful';

@injectable()
@Route('/ping')
export class GetPingEndpoint extends GETEndpoint {
    async handle(req: IGETRequest): Promise<IResponse<unknown>> {
        return new JsonResponse({ pong: true });
    }
}
