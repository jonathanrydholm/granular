import 'reflect-metadata';
import {
    AbstractFunctionality,
    Container,
    Factory,
    IOverride,
} from '@granular/application';
import Pino from 'pino';
import {
    ILogger,
    IGlobalLoggerConfiguration,
    ILoggerConfiguration,
} from './Types';
import { Logger } from './Implementation';

export class GranularLogger extends AbstractFunctionality<
    null,
    null,
    IGlobalLoggerConfiguration
> {
    register(container: Container): void {
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

    async configure(container: Container): Promise<void> {
        try {
            const PinoPretty = await import('pino-pretty');
            container.get<ILogger>('IMainLogger').set(
                Pino(
                    this.getConfiguration().pino,
                    PinoPretty({
                        colorize: true,
                        ...this.getConfiguration()?.prettyOptions,
                    })
                )
            );
        } catch {
            container
                .get<ILogger>('IMainLogger')
                .set(Pino(this.getConfiguration()?.pino));
        }
    }

    async start(): Promise<void> {}

    onOverride(): void {
        throw new Error('Nothing can be overriden in the logger');
    }
}

export * from './Implementation';
export * from './Types';
