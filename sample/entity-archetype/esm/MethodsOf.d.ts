export declare type MethodsOf<T> = {
    [P in keyof T]: T[P] extends (...a: any) => any ? P : never;
}[keyof T];
