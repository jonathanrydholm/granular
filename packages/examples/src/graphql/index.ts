import {
    System,
    IApplication,
    injectable,
    WithFunctionality,
} from '@granular/system';
import { GranularHttpServer } from '@granular/http';
import { GranularGraphql, IGraphQLIdentifiers } from '@granular/graphql';
import { AddressType, UserType } from './UserType';
import { User } from './UserResolver';
import { UserQueryInput } from './UserQueryInput';
import { GraphQLContext } from './Context';

@injectable()
@WithFunctionality({
    functionality: GranularHttpServer,
    configure: { port: 3000 },
})
@WithFunctionality({
    functionality: GranularGraphql,

    extend: [
        {
            identifier: IGraphQLIdentifiers.QUERY_RESOLVER,
            definitions: [User],
        },
        {
            identifier: IGraphQLIdentifiers.OUTPUT_TYPE,
            definitions: [UserType, AddressType],
        },
        {
            identifier: IGraphQLIdentifiers.INPUT_TYPE,
            definitions: [UserQueryInput],
        },
        {
            identifier: IGraphQLIdentifiers.CONTEXT,
            definitions: [GraphQLContext],
        },
    ],
})
class Application implements IApplication {}

new System()
    .withApplications([Application])
    .start()
    .then(() => {
        console.log('Application running');
    });
