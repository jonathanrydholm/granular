import { Container } from './Container';
import {
    IApplication,
    IClassDefinition,
    IInternalApplication,
    IUnknownFunctionality,
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
        await logger.onConfigure({ identifier: 'System' }, this.container);
        const applications =
            this.container.getAll<IInternalApplication>('IApplication');
        for (const application of applications) {
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
                    const functionalityName = `IFunctionality_${uuidv4()}`;
                    container
                        .bind<IUnknownFunctionality>(functionalityName)
                        .to(functionality)
                        .inSingletonScope();
                    const instance =
                        container.get<IUnknownFunctionality>(functionalityName);

                    await instance.bindInternals(container);

                    if (extend) {
                        instance.onLogicExtensions(extend, container);
                    }

                    if (configure) {
                        await instance.onConfigure(configure, container);
                    }
                    instances.push(instance);
                }

                for (const instance of instances) {
                    await instance.start(container);
                }
            }
        }
    }
}
