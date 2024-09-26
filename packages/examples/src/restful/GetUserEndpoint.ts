import { injectable } from '@granular/system';
import {
    GETEndpoint,
    IGETRequest,
    IResponse,
    JsonResponse,
    Route,
} from '@granular/restful';

@injectable()
@Route('/user')
export class GetUserEndpoint extends GETEndpoint {
    async handle(req: IGETRequest): Promise<IResponse<unknown>> {
        return new JsonResponse({ email: 'abc@gmail.com' });
    }
}
