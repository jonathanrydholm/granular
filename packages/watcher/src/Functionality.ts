import { IFunctionality, ILogicExtension } from '@granular/functionality';
import { Container } from '@granular/system';
import {
    IWatcher,
    IWatchManager,
    Overridables,
    WatcherIdentifiers,
} from './Types';
import { WatchManager } from './Implementation';
import { injectable } from 'inversify';

@injectable()
export class GranularWatcher
    implements IFunctionality<Overridables, WatcherIdentifiers>
{
    onLogicExtensions(
        extensions: ILogicExtension<IWatcher, WatcherIdentifiers>[],
        container: Container
    ): void {
        extensions.forEach((extension) => {
            if (extension.identifier === WatcherIdentifiers.WATCHER) {
                extension.definitions.forEach((definition) => {
                    container
                        .bind(extension.identifier)
                        .to(definition)
                        .inSingletonScope();
                });
            }
        });
    }

    onConfigure(configuration: never): void {}

    bindInternals(container: Container): void {
        container
            .bind<IWatchManager>('IWatchManager')
            .to(WatchManager)
            .inSingletonScope();
    }

    async start(container: Container): Promise<void> {
        await container.get<IWatchManager>('IWatchManager').start();
    }
}
