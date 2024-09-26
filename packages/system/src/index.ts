import {
    inject as inversifyInject,
    injectable as inversifyInjectable,
    multiInject as inversifyMultiInject,
    optional as inversifyOptional,
    interfaces as inversifyInterfaces,
} from 'inversify';

export const injectable = inversifyInjectable;
export const inject = inversifyInject;
export const multiInject = inversifyMultiInject;
export const optional = inversifyOptional;
export type Factory<
    T,
    U extends unknown[] = unknown[],
    V extends unknown[] = unknown[],
> = inversifyInterfaces.Factory<T, U, V>;

export * from './Types';
export * from './Implementation';
