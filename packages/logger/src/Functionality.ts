import {
    Container,
    Factory,
    IFunctionality,
    injectable,
} from '@granular/application';
import Pino from 'pino';
import {
    ILogger,
    IGlobalLoggerConfiguration,
    ILoggerConfiguration,
} from './Types';
import { Logger } from './Implementation';

@injectable()
export class GranularLogger
    implements IFunctionality<null, null, IGlobalLoggerConfiguration>
{
    onLogicExtensions(): void {}

    async onConfigure(
        configuration: IGlobalLoggerConfiguration,
        container: Container
    ): Promise<void> {
        try {
            const PinoPretty = await import('pino-pretty');
            container.get<ILogger>('IMainLogger').set(
                Pino(
                    configuration?.pino,
                    PinoPretty({
                        colorize: true,
                        ...configuration?.prettyOptions,
                    })
                )
            );
        } catch {
            container
                .get<ILogger>('IMainLogger')
                .set(Pino(configuration?.pino));
        }
    }

    bindInternals(container: Container): void {
        container.bind<ILogger>('IMainLogger').to(Logger).inSingletonScope();
        container.bind<ILogger>('ILogger').to(Logger).inRequestScope();

        container
            .bind<Factory<ILogger>>('ILoggerFactory')
            .toFactory<ILogger, [ILoggerConfiguration]>((context) => {
                const logger = context.container
                    .get<ILogger>('IMainLogger')
                    .get();
                return (configuration: ILoggerConfiguration) => {
                    const childLogger =
                        context.container.get<ILogger>('ILogger');
                    childLogger.set(logger.child(configuration));
                    return childLogger;
                };
            });
    }

    async start(): Promise<void> {}
}
