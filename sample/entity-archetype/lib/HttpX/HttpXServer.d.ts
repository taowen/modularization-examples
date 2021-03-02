/// <reference types="node" />
import { Database, Scene, ServiceProtocol } from '../Scene';
import type { IncomingMessage, ServerResponse } from 'http';
declare type ServiceClass = new () => any;
export declare class HttpXServer {
    private readonly options;
    constructor(options: {
        database: Database;
        serviceProtocol: ServiceProtocol;
        services: Map<string, ServiceClass>;
        middleware?: (scene: Scene, handler: Function, args: any[]) => Promise<any>;
    });
    handleRequest(req: IncomingMessage, resp: ServerResponse): void;
    private runService;
}
export {};
