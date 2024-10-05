export interface IMetricService {
    createNumericMetric(
        metricName: string,
        metricDescription: string
    ): INumericMetric;
    start(): void;
}

export interface INumericMetric {
    add(value: number): void;
    sub(value: number): void;
    set(value: number): void;
}
