export type IClassDefinition<T> = new (...args: any[]) => T;

export type UnknownClassDefinition = new (...args: any[]) => unknown;
