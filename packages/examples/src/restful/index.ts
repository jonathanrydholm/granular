import {
    IApplication,
    injectable,
    System,
    WithFunctionality,
} from '@granular/application';
import { GranularRestful, RestfulIdentifiers } from '@granular/restful';
import { GetUserEndpoint } from './GetUserEndpoint';
import { GetPingEndpoint } from './GetPingEndpoint';
import { GranularLogger } from '@granular/logger';

@injectable()
@WithFunctionality({
    functionality: GranularLogger,
    configure: {
        pino: { level: 'trace' },
        identifier: 'Application',
    },
})
@WithFunctionality({
    functionality: GranularRestful,
    configure: { port: 5000 },
    extend: [
        {
            definitions: [GetUserEndpoint, GetPingEndpoint],
            identifier: RestfulIdentifiers.ENDPOINT,
        },
    ],
})
class Application implements IApplication {}

new System()
    .withApplications([Application])
    .start()
    .then(() => console.log('Application started'));
