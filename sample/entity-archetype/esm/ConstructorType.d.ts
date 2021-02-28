declare type FlagExcludedType<Base, Type> = {
    [Key in keyof Base]: Base[Key] extends Type ? never : Key;
};
declare type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
declare type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>;
export declare type ConstructorType<T> = Omit<OmitType<T, Function>, 'scene'>;
export {};
