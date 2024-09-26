import { Container } from './Container';
import {
    IApplication,
    IClassDefinition,
    IInternalApplication,
    IUnknownFunctionality,
    IUnknownLogicExtension,
} from '../Types';
import { v4 as uuidv4 } from 'uuid';
import { GranularLogger, ILoggerFactory } from '@granular/logger';

export class System {
    private container: Container;

    constructor() {
        this.container = new Container();
    }

    /** Sets applications of this system */
    withApplications(applications: IClassDefinition<IApplication, unknown>[]) {
        /*
            Cast applications to internal applications which contain metadata through decorators
        */
        const internalApplications = applications as IClassDefinition<
            IInternalApplication,
            unknown
        >[];
        internalApplications.forEach((application) => {
            this.container
                .bind<IInternalApplication>('IApplication')
                .to(application)
                .inSingletonScope();
        });
        return this;
    }

    /** Starts the system */
    async start() {
        const logger = new GranularLogger();
        logger.bindInternals(this.container);
        await logger.onConfigure(
            { identifier: 'System', pino: { level: 'trace' } },
            this.container
        );
        const systemLogger = this.container.get<ILoggerFactory>(
            'ILoggerFactory'
        )({ name: 'System' });
        const applications = this.getPrioritizedApplications();
        for (const application of applications) {
            systemLogger
                .get()
                .info(
                    `Starting application ${application._granular_application_identifier}`
                );
            const container = new Container();
            container.parent = this.container;
            /*
                May be undefined in case of no functionality decorators
            */
            if (application._granular_functionalities) {
                const instances: IUnknownFunctionality[] = [];
                for (const granularFunctionality of application._granular_functionalities) {
                    const { functionality, configure, extend } =
                        granularFunctionality;

                    const { instance, identifier } =
                        this.bindAndReturnFunctionality(
                            container,
                            functionality
                        );

                    systemLogger
                        .get()
                        .trace(
                            `Bound functionality ${identifier} to ${application._granular_application_identifier || 'Unknown application'}`
                        );

                    await this.handleFunctionalityLifecycle(
                        container,
                        instance,
                        extend,
                        configure
                    );

                    instances.push(instance);
                }

                for (const instance of instances) {
                    await instance.start(container);
                }
            }
        }
    }

    private getPrioritizedApplications(): IInternalApplication[] {
        return this.container
            .getAll<IInternalApplication>('IApplication')
            .sort(
                (a, b) =>
                    (b._granular_application_priority || 0) -
                    (a._granular_application_priority || 0)
            );
    }

    private bindAndReturnFunctionality(
        container: Container,
        definition: IClassDefinition<IUnknownFunctionality>
    ): { instance: IUnknownFunctionality; identifier: string } {
        const identifier =
            typeof definition === 'function' ? definition.name : uuidv4();
        container
            .bind<IUnknownFunctionality>(identifier)
            .to(definition)
            .inSingletonScope();
        return {
            instance: container.get<IUnknownFunctionality>(identifier),
            identifier,
        };
    }

    private async handleFunctionalityLifecycle(
        container: Container,
        functionality: IUnknownFunctionality,
        extend?: IUnknownLogicExtension[],
        configure?: unknown
    ) {
        await functionality.bindInternals(container);

        if (extend) {
            functionality.onLogicExtensions(extend, container);
        }

        if (configure) {
            await functionality.onConfigure(configure, container);
        }
    }
}
