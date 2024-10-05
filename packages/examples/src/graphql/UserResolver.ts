import { injectable } from '@granular/system';
import { IUserType, UserType } from './UserType';
import { IUserQueryInput, UserQueryInput } from './UserQueryInput';
import { IGraphQLResolver, InputType, OutputType } from '@granular/graphql';

@injectable()
@InputType(UserQueryInput)
@OutputType(UserType)
export class User implements IGraphQLResolver<IUserType, IUserQueryInput> {
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
