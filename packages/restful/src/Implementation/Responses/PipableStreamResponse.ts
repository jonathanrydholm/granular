import { IResponse, IResponseType } from '../../Types';
import { AbstractResponse } from './AbstractResponse';

export type PipableStreamResponseValue = <
    Writable extends NodeJS.WritableStream,
>(
    destination: Writable
) => Writable;

export class PipableStreamResponse
    extends AbstractResponse<PipableStreamResponseValue>
    implements IResponse<PipableStreamResponseValue>
{
    getType(): IResponseType {
        return 'pipable_stream';
    }
}
