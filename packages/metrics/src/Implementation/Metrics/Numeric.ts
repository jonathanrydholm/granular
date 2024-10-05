import { INumericMetric } from '../../Types';
import { Gauge } from 'prom-client';

export class NumericMetric implements INumericMetric {
    private gauge: Gauge;

    constructor(name: string, help: string) {
        this.gauge = new Gauge({
            help,
            name,
        });
    }

    add(value: number): void {
        this.gauge.inc(value);
    }

    sub(value: number): void {
        this.gauge.dec(value);
    }

    set(value: number): void {
        this.gauge.set(value);
    }
}
