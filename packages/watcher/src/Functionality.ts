import {
    AbstractFunctionality,
    Container,
    IOverride,
} from '@granular/application';
import { IWatchManager, Overridables, WatcherIdentifiers } from './Types';
import { WatchManager } from './Implementation';

export class GranularWatcher extends AbstractFunctionality<
    Overridables,
    WatcherIdentifiers,
    null
> {
    register(container: Container): Promise<void> | void {
        container
            .bind<IWatchManager>('IWatchManager')
            .to(WatchManager)
            .inSingletonScope();
    }

    configure(container: Container): Promise<void> | void {}

    async start(container: Container): Promise<void> {
        await container.get<IWatchManager>('IWatchManager').start();
    }

    onOverride(
        overridables: IOverride<Overridables, WatcherIdentifiers>,
        container: Container
    ): void {
        if (overridables.identifier === WatcherIdentifiers.WATCHER) {
            overridables.logic.forEach((service) => {
                container
                    .bind(overridables.identifier)
                    .to(service)
                    .inSingletonScope();
            });
        }
    }
}
