export type IFunctionalityDefinition<T, UConfiguration> = new (
    ...args: [UConfiguration]
) => T;
