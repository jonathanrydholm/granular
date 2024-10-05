import { IGraphQLContext } from '@granular/graphql';
import { FastifyRequest, FastifyReply } from '@granular/http';
import { injectable } from '@granular/system';

@injectable()
export class GraphQLContext implements IGraphQLContext {
    async onInitialize(req: FastifyRequest, res: FastifyReply): Promise<void> {
        await new Promise<void>((resolve) => setTimeout(resolve, 200));
    }
}
