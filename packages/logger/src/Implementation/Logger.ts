import { injectable } from '@granular/system';
import type { Logger as PinoLogger } from 'pino';
import { ILogger } from '../Types';

@injectable()
export class Logger implements ILogger {
    private logger: PinoLogger<never, boolean>;

    get(): PinoLogger<never, boolean> {
        return this.logger;
    }

    set(logger: PinoLogger<never, boolean>): void {
        this.logger = logger;
    }
}
