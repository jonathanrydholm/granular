import { IGraphQLType, IGraphQLTypeDescription } from '@granular/graphql';
import { injectable } from '@granular/system';

export interface IUserQueryInput {
    email: string;
}

@injectable()
export class UserQueryInput implements IGraphQLType<IUserQueryInput> {
    getType(): IGraphQLTypeDescription<IUserQueryInput> {
        return {
            email: 'String',
        };
    }
}
