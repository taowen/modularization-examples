// 封装写操作，进行业务规则校验
export abstract class Command {
  constructor(props: Record<string, any>) {
    Object.assign(this, props);
  }
  public abstract run(): any;

  public static of<C extends Command>(commandClass: new (props: Record<string, any>) => C) {
    return (
      props?: ConstructorType<C>
    ): C['run'] => {
      return new commandClass(props as any).run();
    };
  }
}

// copied from https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript
// 1 Transform the type to flag all the undesired keys as 'never'
type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };
    
// 2 Get the keys that are not flagged as 'never'
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
    
// 3 Use this with a simple Pick to get the right interface, excluding the undesired type
type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>;
    
// 4 Exclude the Function type to only get properties
type ConstructorType<T> = OmitType<T, Function>;