import { Scene, ServiceProtocol } from "./Scene";
export declare class HttpServiceProtocol implements ServiceProtocol {
    static project: string;
    useServices(scene: Scene, project?: string): any;
}
