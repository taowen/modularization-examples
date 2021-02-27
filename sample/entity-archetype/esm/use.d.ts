declare type Await<T> = T extends Promise<infer U> ? U : T;
declare type MethodsOf<T> = {
    [P in keyof T]: T[P] extends (...a: any) => any ? P : never;
}[keyof T];
export declare function use<T>(project?: string): {
    [P in MethodsOf<T>]: (...a: Parameters<T[P]>) => Await<ReturnType<T[P]>>;
};
export declare function withRpc<T extends object>(createObject: () => T): Promise<T>;
export {};
