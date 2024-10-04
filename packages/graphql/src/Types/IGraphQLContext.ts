import { FastifyReply, FastifyRequest } from '@granular/http';

export interface IGraphQLContext {
    onInitialize(req: FastifyRequest, res: FastifyReply): Promise<void>;
}

export type IGraphQLContextFactory = (
    req: FastifyRequest,
    res: FastifyReply
) => Promise<IGraphQLContext>;
