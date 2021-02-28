import type { ConstructorType } from "./ConstructorType";

// 封装写操作，进行业务规则校验
export abstract class Command {
  constructor(props: Record<string, any>) {
    Object.assign(this, props);
  }
  public abstract run(): any;

  public static toRun<C extends Command>(
    commandClass: new (props: Record<string, any>) => C
  ) {
    return (props: {} extends ConstructorType<C> ? void : ConstructorType<C>): C["run"] => {
      return new commandClass(props as any).run();
    };
  }
}
