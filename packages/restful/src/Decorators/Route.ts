import { IEndpoint } from '../Types';

export function Route(route: string) {
    return function (target: new (...args: any[]) => IEndpoint<unknown>) {
        target.prototype.getRoute = function () {
            return route;
        };
    };
}
