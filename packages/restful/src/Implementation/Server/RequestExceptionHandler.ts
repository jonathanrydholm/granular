import { injectable } from '@granular/application';
import type { Response } from 'express';
import { HttpError } from '../Errors';
import { IRequestExceptionHandler } from '../../Types';

@injectable()
export class RequestExceptionHandler implements IRequestExceptionHandler {
    handle(error: unknown, resonse: Response): Promise<void> | void {
        if (error instanceof HttpError) {
            resonse.status(error.getStatusCode()).send(error.message);
            return;
        }
        resonse.status(500).send('Unknown error');
    }
}
