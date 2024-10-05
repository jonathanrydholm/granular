import {
    IGraphQLResolver,
    IGraphQLType,
    IGraphQLTypeDescription,
    OutputType,
} from '@granular/graphql';
import { injectable } from '@granular/system';

export interface IUserType {
    email: string;
    address: IAddress;
}

export interface IAddress {
    city: string;
    street: string;
}

@injectable()
export class AddressType implements IGraphQLType<IAddress> {
    getType(): IGraphQLTypeDescription<IAddress> {
        return {
            city: 'String',
            street: 'String',
        };
    }
}

// injectable?
@OutputType(AddressType)
export class AddressResolver implements IGraphQLResolver<IAddress> {
    async handle(
        parent: never,
        input: never,
        context: never
    ): Promise<IAddress> {
        await new Promise<void>((resolve) => setTimeout(resolve, 200));

        return { city: 'Åmål', street: 'strandgatan' };
    }
}

@injectable()
export class UserType implements IGraphQLType<IUserType> {
    getType(): IGraphQLTypeDescription<IUserType> {
        return {
            email: 'String',
            address: { resolver: new AddressResolver(), type: AddressType },
        };
    }
}
