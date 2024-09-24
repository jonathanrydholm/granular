import type { Express } from 'express';
import { IServerConfiguration } from '../../Types';
import { injectable } from '@granular/application';

@injectable()
export class ServerConfiguration implements IServerConfiguration {
    private port: number | null;
    private express: Express | null;

    constructor() {
        this.port = null;
        this.express = null;
    }

    getExpress() {
        return this.express;
    }

    setExpress(express: Express): void {
        this.express = express;
    }

    getPort(): number | null {
        return this.port || 5000;
    }

    setPort(port: number): void {
        this.port = port;
    }
}
