// rpc 接口
export class Gateway {
}

export type GatewayClass = Function & { new (): Gateway }; 