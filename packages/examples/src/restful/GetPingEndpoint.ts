import { injectable } from '@granular/application';
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
