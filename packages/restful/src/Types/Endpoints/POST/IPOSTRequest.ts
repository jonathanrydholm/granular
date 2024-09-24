import { IncomingHttpHeaders } from 'http';
import type { ParsedQs } from 'qs';

export interface IPOSTRequest<TRequestBody> {
    headers: IncomingHttpHeaders;
    query: ParsedQs;
    body: TRequestBody;
}
