export type IClassDefinition<T, TConfiguration = never> = new (
    ...args: any[]
) => T;

export type UnknownClassDefinition = new (...args: any[]) => unknown;
