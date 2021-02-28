declare type Await<T> = T extends Promise<infer U> ? U : T;
declare type MethodsOf<T> = {
    [P in keyof T]: T[P] extends (...a: any) => any ? P : never;
}[keyof T];
declare type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export declare function use<T>(project?: string): {
    [P in MethodsOf<T>]: (...a: Parameters<OmitFirstArg<T[P]>>) => Await<ReturnType<T[P]>>;
};
export declare function awaitRpc(obj: object): Promise<void>;
export {};
