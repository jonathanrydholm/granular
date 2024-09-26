import {
    Container,
    IApplication,
    IFunctionality,
    ILogicExtension,
    injectable,
    System,
    WithFunctionality,
} from '@granular/application';
import { GranularLogger, ILoggerFactory } from '@granular/logger';

@injectable()
class CustomFunctionality implements IFunctionality<null, null, null> {
    onLogicExtensions(): void {}
    onConfigure(): void | Promise<void> {}
    bindInternals(): void | Promise<void> {}

    async start(container: Container): Promise<void> {
        container
            .get<ILoggerFactory>(
                'ILoggerFactory'
            )({ name: 'CustomFunctionality' })
            .get()
            .info('Hello World!');
    }
}

@injectable()
@WithFunctionality({
    functionality: GranularLogger,
    configure: {
        pino: { level: 'trace' },
        identifier: 'Application',
    },
})
@WithFunctionality({
    functionality: CustomFunctionality,
})
class Application implements IApplication {}
new System()
    .withApplications([Application])
    .start()
    .then(() => console.log('Application started'));
