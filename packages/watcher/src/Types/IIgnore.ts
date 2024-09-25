import { Stats } from 'fs';

export type IIgnore = (path: string, stats: Stats) => boolean;
