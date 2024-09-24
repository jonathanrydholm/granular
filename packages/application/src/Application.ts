import { Container } from 'inversify';
import { IApplication, IFunctionality } from './IFunctionality';
import { IFunctionalityDefinition } from './IFunctionalityDefinition';
import { IOverride } from './IOverride';

export class Application implements IApplication {
    private functionalities: IFunctionality<unknown, unknown>[] = [];
    private container: Container;

    constructor() {
        this.container = new Container();
    }

    addFunctionality<T, KIdentifier, UConfiguration>(
        granular: {
            Functionality: IFunctionalityDefinition<
                IFunctionality<T, KIdentifier>,
                UConfiguration
            >;
            configuration?: UConfiguration;
        },
        ...args: IOverride<T, KIdentifier>[]
    ) {
        const instance = new granular.Functionality(granular.configuration);
        this.functionalities.push(instance);
        args.forEach((override) => {
            instance.override(override);
        });
        return this;
    }

    async start() {
        await this.registerFunctionalities();
        await this.configureFunctionalities();
        await this.startFunctionalities();
    }

    private async registerFunctionalities() {
        for (const functionality of this.functionalities) {
            await functionality.register(this.container);
            functionality.getOverrides().forEach((override) => {
                functionality.onOverride(override, this.container);
            });
        }
    }

    private async configureFunctionalities() {
        for (const functionality of this.functionalities) {
            await functionality.configure(this.container);
        }
    }

    private async startFunctionalities() {
        for (const functionality of this.functionalities) {
            await functionality.start(this.container);
        }
    }
}
