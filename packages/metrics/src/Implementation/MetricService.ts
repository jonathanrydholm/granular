import { injectable } from '@granular/system';
import { IMetricService, INumericMetric } from '../Types';
import { NumericMetric } from './Metrics';

@injectable()
export class MetricService implements IMetricService {
    createNumericMetric(
        metricName: string,
        description: string
    ): INumericMetric {
        return new NumericMetric(metricName, description);
    }
}
