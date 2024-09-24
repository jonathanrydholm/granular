import { Application } from '@granular/application';
import { GranularRestful, RestfulIdentifiers } from '@granular/restful';
import { GetUserEndpoint } from './GetUserEndpoint';
import { GetPingEndpoint } from './GetPingEndpoint';
import { GranularLogger } from '@granular/logger';

new Application()
    .addFunctionality({
        Functionality: GranularLogger,
        configuration: {
            pino: { level: 'trace' },
            identifier: 'Application',
        },
    })
    .addFunctionality(
        { Functionality: GranularRestful, configuration: { port: 5000 } },
        {
            identifier: RestfulIdentifiers.ENDPOINT,
            logic: [GetUserEndpoint, GetPingEndpoint],
        }
    )
    .start()
    .then(() => {
        console.log('Application running');
    });
