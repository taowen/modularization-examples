import { MethodsOf } from "./MethodsOf";
export declare class Gateway {
}
export declare type GatewayClass = Function & {
    new (): Gateway;
};
declare type Await<T> = T extends Promise<infer U> ? U : T;
declare type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export declare function use<T>(project?: string): {
    [P in MethodsOf<T>]: (...a: Parameters<OmitFirstArg<T[P]>>) => Await<ReturnType<T[P]>>;
};
export {};
