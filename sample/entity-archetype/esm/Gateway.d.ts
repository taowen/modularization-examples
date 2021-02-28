export declare class Gateway {
}
export declare type GatewayClass<T extends Gateway = any> = Function & {
    new (): T;
};
