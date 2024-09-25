export interface IUsePollingOptions {
    /**
     * (default: 100)
     * Interval of file system polling, in milliseconds.
     * You may also set the CHOKIDAR_INTERVAL env variable to override this option.
     */
    interval?: number;
    /**
     * (default: 300).
     * Interval of file system polling for binary files
     */
    binaryInterval?: number;
}
