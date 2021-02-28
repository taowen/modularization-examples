import type { ConstructorType } from "./ConstructorType";
export declare abstract class Command {
    constructor(props: Record<string, any>);
    abstract run(): any;
    static toRun<C extends Command>(commandClass: new (props: Record<string, any>) => C): (props: {} extends ConstructorType<C> ? void : ConstructorType<C>) => C["run"];
}
