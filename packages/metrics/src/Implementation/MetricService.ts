import { injectable } from '@granular/system';
import { IMetricService, INumericMetric } from '../Types';
import { NumericMetric } from './Metrics';
import { collectDefaultMetrics } from 'prom-client';

@injectable()
export class MetricService implements IMetricService {
    start(): void {
        collectDefaultMetrics();
    }
    createNumericMetric(
        metricName: string,
        description: string
    ): INumericMetric {
        return new NumericMetric(metricName, description);
    }
}
