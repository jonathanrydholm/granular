export type IClassDefinition<T, TConfiguration = never> = new (
    ...args: [TConfiguration]
) => T;

export type UnknownClassDefinition = new (...args: any[]) => unknown;
