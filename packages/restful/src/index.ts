import 'reflect-metadata';
export * from './Implementation';
export * from './Types';
export * from './Decorators';

import {
    Factory,
    Container,
    IFunctionality,
    ILogicExtension,
    injectable,
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

@injectable()
export class GranularRestful
    implements
        IFunctionality<Overridables, RestfulIdentifiers, { port?: number }>
{
    onLogicExtensions(
        extensions: ILogicExtension<
            Overridables,
            RestfulIdentifiers,
            { port?: number }
        >[],
        container: Container
    ): void {
        extensions.forEach(({ definitions, identifier }) => {
            if (identifier === RestfulIdentifiers.ENDPOINT) {
                definitions.forEach((definition) => {
                    container
                        .bind(identifier)
                        .to(definition)
                        .inSingletonScope();
                });
            } else {
                definitions.forEach((definition) => {
                    container.rebind(identifier).to(definition);
                });
            }
        });
    }

    onConfigure(
        configuration: { port?: number },
        container: Container
    ): void | Promise<void> {
        if (configuration?.port) {
            container
                .get<IServerConfiguration>(
                    RestfulIdentifiers.SERVER_CONFIGURATION
                )
                .setPort(configuration.port);
        }
        container.get<IServer>(RestfulIdentifiers.SERVER).configure();
    }

    bindInternals(container: Container): void | Promise<void> {
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

    async start(container: Container): Promise<void> {
        await container.get<IServer>(RestfulIdentifiers.SERVER).start();
    }
}
