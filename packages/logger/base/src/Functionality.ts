import { Container, Factory, injectable } from '@granular/injection';
import { IFunctionality, ILogicExtension } from '@granular/functionality';
import { ILogger, ILoggerConfiguration } from './Types';
import { Logger } from './Implementation';

@injectable()
export class GranularLogger
    implements IFunctionality<ILogger, 'ILogger', ILoggerConfiguration>
{
    private configuration: ILoggerConfiguration = {
        name: '',
        level: 'info',
    };

    onLogicExtensions(
        extensions: ILogicExtension<ILogger, 'ILogger'>[],
        container: Container
    ): void {
        container.rebind<ILogger>('ILogger').to(extensions[0].definitions[0]);
    }

    onConfigure(configuration: ILoggerConfiguration): void {
        this.configuration = configuration;
    }

    bindInternals(container: Container): void {
        container.bind<ILogger>('ILogger').to(Logger).inRequestScope();

        container
            .bind<Factory<ILogger>>('ILoggerFactory')
            .toFactory<ILogger, [ILoggerConfiguration]>((context) => {
                return (configuration: ILoggerConfiguration) => {
                    const logger = context.container.get<ILogger>('ILogger');
                    logger.init({
                        ...this.configuration,
                        ...configuration,
                    });
                    return logger;
                };
            });
    }

    async start(): Promise<void> {}
}
