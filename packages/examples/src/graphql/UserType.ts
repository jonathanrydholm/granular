import { IGraphQLType, IGraphQLTypeDescription } from '@granular/graphql';
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

@injectable()
export class UserType implements IGraphQLType<IUserType> {
    getType(): IGraphQLTypeDescription<IUserType> {
        return {
            email: 'String',
            address: AddressType,
        };
    }
}
