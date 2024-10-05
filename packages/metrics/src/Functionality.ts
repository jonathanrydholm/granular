import { Container, injectable } from '@granular/system';
import { IFunctionality } from '@granular/functionality';
import { IMetricService } from './Types';
import { MetricService } from './Implementation';

@injectable()
export class GranularMetrics implements IFunctionality<null, null> {
    onLogicExtensions(): void {}

    onConfigure(): void {}

    bindInternals(container: Container): void {
        container
            .bind<IMetricService>('IMetricService')
            .to(MetricService)
            .inSingletonScope();
    }

    async start(container: Container): Promise<void> {
        container.get<IMetricService>('IMetricService').start();
    }
}
