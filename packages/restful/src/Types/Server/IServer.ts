import type { Express } from 'express';

export interface IServer {
    configure(): void;
    start(): Promise<void>;
    getApp(): Express;
}
