import 'reflect-metadata';
import {
    AbstractFunctionality,
    Factory,
    IOverride,
} from '@granular/application';
import { Container } from 'inversify';
import Pino, { LoggerOptions } from 'pino';
import { ILogger } from './Types';
import { Logger } from './Implementation';

export class GranularLogger extends AbstractFunctionality<
    null,
    null,
    LoggerOptions
> {
    register(container: Container): void {
        container.bind<ILogger>('IMainLogger').to(Logger).inSingletonScope();
        container.bind<ILogger>('ILogger').to(Logger).inRequestScope();

        container
            .bind<Factory<ILogger>>('ILoggerFactory')
            .toFactory<ILogger, [string]>((context) => {
                const logger = context.container
                    .get<ILogger>('IMainLogger')
                    .get();
                return (name: string) => {
                    const childLogger =
                        context.container.get<ILogger>('ILogger');
                    childLogger.set(
                        logger.child({ name }, this.getConfiguration())
                    );
                    return childLogger;
                };
            });
    }

    async configure(container: Container): Promise<void> {
        try {
            const PinoPretty = await import('pino-pretty');
            container.get<ILogger>('IMainLogger').set(
                Pino(
                    PinoPretty({
                        colorize: true,
                        ...this.getConfiguration(),
                    })
                )
            );
        } catch {
            container
                .get<ILogger>('IMainLogger')
                .set(Pino(this.getConfiguration()));
        }
    }

    async start(container: Container): Promise<void> {}

    onOverride(
        overridables: IOverride<null, null>,
        container: Container
    ): void {
        throw new Error('Nothing can be overriden in the logger');
    }
}

export * from './Implementation';
export * from './Types';
