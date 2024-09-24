import 'reflect-metadata';
export * from './Implementation';
export * from './Types';
export * from './Decorators';

import {
    AbstractFunctionality,
    Factory,
    IOverride,
    Container,
} from '@granular/application';
import {
    IRequestExceptionHandler,
    IRequestHandler,
    IResponseHandler,
    IServer,
    IServerConfiguration,
    Overridables,
    RestfulIdentifiers,
} from './Types';
import {
    RequestExceptionHandler,
    RequestHandler,
    ResponseHandler,
    Server,
    ServerConfiguration,
} from './Implementation';

export class GranularRestful extends AbstractFunctionality<
    Overridables,
    RestfulIdentifiers,
    { port?: number }
> {
    register(container: Container): void {
        container
            .bind<IServer>(RestfulIdentifiers.SERVER)
            .to(Server)
            .inSingletonScope();
        container
            .bind<IServerConfiguration>(RestfulIdentifiers.SERVER_CONFIGURATION)
            .to(ServerConfiguration)
            .inSingletonScope();
        container
            .bind<IRequestExceptionHandler>(
                RestfulIdentifiers.REQUEST_EXCEPTION_HANDLER
            )
            .to(RequestExceptionHandler)
            .inSingletonScope();

        container
            .bind<IRequestHandler>(RestfulIdentifiers.REQUEST_HANDLER)
            .to(RequestHandler)
            .inRequestScope();

        container
            .bind<IResponseHandler>(RestfulIdentifiers.RESPONSE_HANDLER)
            .to(ResponseHandler)
            .inSingletonScope();

        container
            .bind<Factory<IRequestHandler>>('IRequestHandlerFactory')
            .toFactory<IRequestHandler, []>((context) => {
                return () => {
                    return context.container.get<IRequestHandler>(
                        RestfulIdentifiers.REQUEST_HANDLER
                    );
                };
            });
    }

    configure(container: Container): void {
        const configuration = this.getConfiguration();
        if (configuration?.port) {
            container
                .get<IServerConfiguration>(
                    RestfulIdentifiers.SERVER_CONFIGURATION
                )
                .setPort(configuration.port);
        }
        container.get<IServer>(RestfulIdentifiers.SERVER).configure();
    }

    async start(container: Container): Promise<void> {
        await container.get<IServer>(RestfulIdentifiers.SERVER).start();
    }

    onOverride(
        overridables: IOverride<Overridables, RestfulIdentifiers>,
        container: Container
    ) {
        if (overridables.identifier === RestfulIdentifiers.ENDPOINT) {
            overridables.logic.forEach((service) => {
                container
                    .bind(overridables.identifier)
                    .to(service)
                    .inSingletonScope();
            });
        } else {
            overridables.logic.forEach((service) => {
                container.rebind(overridables.identifier).to(service);
            });
        }
    }
}
