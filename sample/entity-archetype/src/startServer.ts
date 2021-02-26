import { Gateway } from "./Gateway";

type GatewayClass = Function & { new (): Gateway }; 

export function startServer(...gatewayClasses: GatewayClass[]) {
}