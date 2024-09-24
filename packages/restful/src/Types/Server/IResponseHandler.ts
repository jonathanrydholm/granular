import { IResponse } from '../Responses';
import type { Response } from 'express';

export interface IResponseHandler {
    handle(response: IResponse<unknown>, raw: Response): Promise<void> | void;
}
