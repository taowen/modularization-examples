import type { ConstructorType } from "./ConstructorType";
import { Scene } from "./Scene";
export declare abstract class Command {
    readonly scene: Scene;
    constructor(scene: Scene, props: Record<string, any>);
    abstract run(): any;
    protected call<C extends Command>(commandClass: new (scene: Scene, props: Record<string, any>) => C, props: {} extends ConstructorType<C> ? void : ConstructorType<C>): ReturnType<C["run"]>;
}
export declare function toRun<C extends Command>(commandClass: new (scene: Scene, props: Record<string, any>) => C): (scene: Scene, props: {} extends ConstructorType<C> ? void : ConstructorType<C>) => ReturnType<C["run"]>;
export declare function call<C extends Command>(scene: Scene, commandClass: new (scene: Scene, props: Record<string, any>) => C, props: {} extends ConstructorType<C> ? void : ConstructorType<C>): ReturnType<C["run"]>;
