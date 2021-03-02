// Gateway 不是必须的，一般我们直接把 ActiveRecord 的静态方法当 remote service 来用
// 当我们需要把一部分的远程方法单独列出来的时候，可以把它们放到 Gateway 上
export class Gateway {}

export type GatewayClass<T extends Gateway = any> = Function & { new (): T };
