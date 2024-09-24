import { IncomingHttpHeaders } from 'http';
import { ParsedQs } from 'qs';

export interface IGETRequest {
    headers: IncomingHttpHeaders;
    query: ParsedQs;
}
