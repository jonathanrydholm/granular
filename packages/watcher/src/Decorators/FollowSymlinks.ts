import { IWatcher } from '../Types';

export function FollowSymlinks(followSymlinks: boolean) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.followSymlinks = function () {
            return followSymlinks;
        };
    };
}
