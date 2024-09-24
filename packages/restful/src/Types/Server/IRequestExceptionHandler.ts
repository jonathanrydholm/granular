import type { Response } from 'express';

export interface IRequestExceptionHandler {
    handle(error: unknown, resonse: Response): Promise<void> | void;
}
