import { RemoteService, Scene } from "./Scene";
export declare class HttpRemoteService implements RemoteService {
    static project: string;
    useService(scene: Scene, project?: string): any;
}
