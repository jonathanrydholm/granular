import { Container } from './Container';
import { IFunctionality } from './IFunctionality';
import { IOverride } from './IOverride';

export abstract class AbstractFunctionality<T, KIdentifier, UConfiguration>
    implements IFunctionality<T, KIdentifier>
{
    private overrides: IOverride<T, KIdentifier>[] = [];
    private configuration: UConfiguration;

    constructor(configuration: UConfiguration) {
        this.configuration = configuration;
    }

    protected getConfiguration() {
        return this.configuration;
    }

    getOverrides(): IOverride<T, KIdentifier>[] {
        return this.overrides;
    }

    abstract register(container: Container): Promise<void> | void;
    abstract configure(container: Container): Promise<void> | void;
    abstract start(container: Container): Promise<void>;
    abstract onOverride(
        overridables: IOverride<T, KIdentifier>,
        container: Container
    ): void;

    override(overriden: IOverride<T, KIdentifier>): void {
        this.overrides.push(overriden);
    }
}
