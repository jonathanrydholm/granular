import type { Express } from 'express';

export interface IServerConfiguration {
    getPort(): number | null;
    setPort(port: number): void;
    getExpress(): Express | null;
    setExpress(express: Express): void;
}
