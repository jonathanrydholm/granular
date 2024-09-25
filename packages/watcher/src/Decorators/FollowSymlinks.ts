import { IWatcher } from '../Types';

/**
 * (default: true).
 * When false, only the symlinks themselves will be watched for changes
 * instead of following the link references and bubbling events through the link's path
 */
export function FollowSymlinks(followSymlinks: boolean) {
    return function (target: new (...args: any[]) => IWatcher) {
        target.prototype.followSymlinks = function () {
            return followSymlinks;
        };
    };
}
