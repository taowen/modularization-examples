import { Scene, ServiceProtocol } from '../Scene';
export declare class HttpXClient implements ServiceProtocol {
    static project: string;
    useServices(scene: Scene, project?: string): any;
}
