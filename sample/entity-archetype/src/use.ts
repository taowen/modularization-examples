type Await<T> = T extends Promise<infer U> ? U : T

type MethodsOf<T> = {
    [P in keyof T]: T[P] extends (...a: any) => any ? P : never;
}[keyof T];

// default to call current project server
export function use<T>(project?: string): {
    [P in MethodsOf<T>]: (...a: Parameters<T[P]>) => Await<ReturnType<T[P]>>;
} {
    return undefined as any;
}