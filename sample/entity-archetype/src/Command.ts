import type { ConstructorType } from "./ConstructorType";
import { Scene } from "./Scene";

// 封装写操作，进行业务规则校验
export abstract class Command {
  constructor(public readonly scene: Scene, props: Record<string, any>) {
    Object.assign(this, props);
  }
  public abstract run(): any;

  protected call<C extends Command>(
    commandClass: new (scene: Scene, props: Record<string, any>) => C,
    props: {} extends ConstructorType<C> ? void : ConstructorType<C>
  ): ReturnType<C["run"]> {
    return call(this.scene, commandClass, props)
  }
}

export function toRun<C extends Command>(
  commandClass: new (scene: Scene, props: Record<string, any>) => C
) {
  return (scene: Scene, props: {} extends ConstructorType<C> ? void : ConstructorType<C>): ReturnType<C["run"]> => {
    return new commandClass(scene, props as any).run();
  };
}

export function call<C extends Command>(
  scene: Scene,
  commandClass: new (scene: Scene, props: Record<string, any>) => C,
  props: {} extends ConstructorType<C> ? void : ConstructorType<C>
): ReturnType<C["run"]> {
  return new commandClass(scene, props as any).run();
}