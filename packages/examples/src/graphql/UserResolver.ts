import { IGraphQLResolver } from '@granular/graphql/src/Types/IGraphQLResolver';
import { injectable, UnknownClassDefinition } from '@granular/system';
import { IUserType, UserType } from './UserType';
import { IUserQueryInput, UserQueryInput } from './UserQueryInput';

@injectable()
export class User implements IGraphQLResolver<IUserType, IUserQueryInput> {
    getOutputType(): UnknownClassDefinition | string {
        return UserType;
    }

    getInputType?(): UnknownClassDefinition | string {
        return UserQueryInput;
    }

    async handle(
        parent: never,
        input: IUserQueryInput,
        context: never
    ): Promise<IUserType> {
        if (input.email === 'xyz@gmail.com') {
            return {
                address: { city: 'Åmål', street: 'strandgatan' },
                email: 'xyz@gmail.com',
            };
        }

        return null;
    }
}
