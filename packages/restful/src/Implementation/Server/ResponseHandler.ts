import { injectable } from '@granular/application';
import type { Response } from 'express';
import { IResponse, IResponseHandler } from '../../Types';
import { AbstractResponse } from '../Responses/AbstractResponse';

@injectable()
export class ResponseHandler implements IResponseHandler {
    handle(response: IResponse<unknown>, raw: Response): Promise<void> | void {
        if (response instanceof AbstractResponse) {
            switch (response.getType()) {
                case 'json': {
                    raw.status(200).json(response.getValue());
                    return;
                }
                case 'pipable_stream': {
                    response.getValue()(raw);
                    return;
                }
                case 'redirect': {
                    raw.redirect(response.getValue());
                    return;
                }
                case 'string': {
                    raw.status(200).send(response.getValue());
                    return;
                }
            }
        }
        raw.status(500).send('Unsupported response type');
    }
}
