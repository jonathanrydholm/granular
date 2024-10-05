export interface IMetricService {
    createNumericMetric(
        metricName: string,
        metricDescription: string
    ): INumericMetric;
}

export interface INumericMetric {
    add(value: number): void;
    sub(value: number): void;
    set(value: number): void;
}
