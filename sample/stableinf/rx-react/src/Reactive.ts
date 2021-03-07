import { Atom, Scene, SimpleAtom } from '@stableinf/io';

const mapMutatorMethods: PropertyKey[] = ['set', 'clear', 'delete'];
const mapIteratorMethods: PropertyKey[] = ['keys', 'values', 'entries', Symbol.iterator];
const setMutatorMethods: PropertyKey[] = ['add', 'clear', 'delete'];
const setIteratorMethods: PropertyKey[] = ['keys', 'values', 'entries', Symbol.iterator];

export class Reactive {
    private atoms = new Map<PropertyKey, Atom>();
    constructor(props?: Record<string, any>) {
        Object.assign(this, props);
    }
    public attachTo(scene: Scene) {
        const baseHandler: ProxyHandler<any> = {
            get: (target, propertyKey, receiver) => {
                scene.subscribe(this.atom(propertyKey));
                return this.wrapValue(
                    scene,
                    this.atom(propertyKey),
                    Reflect.get(target, propertyKey),
                );
            },
            set: (target, propertyKey, value, receiver) => {
                const returnValue = Reflect.set(target, propertyKey, value, receiver);
                scene.notifyChange(this.atom(propertyKey));
                return returnValue;
            },
        };
        return new Proxy(this, baseHandler);
    }
    private wrapValue(scene: Scene, atom: Atom, wrappee: any): any {
        if (typeof wrappee === 'object') {
            if (wrappee instanceof Map) {
                return new Proxy(wrappee, {
                    get: (target, propertyKey, receiver) => {
                        return this.wrapMapValue(
                            scene,
                            atom,
                            target, // notice here is not receiver
                            propertyKey,
                            Reflect.get(target, propertyKey),
                        );
                    },
                });
            } else if (wrappee instanceof Set) {
                return new Proxy(wrappee, {
                    get: (target, propertyKey, receiver) => {
                        return this.wrapSetValue(
                            scene,
                            atom,
                            target, // notice here is not receiver
                            propertyKey,
                            Reflect.get(target, propertyKey),
                        );
                    },
                });
            } else if (wrappee instanceof Date) {
                return wrappee;
            }
            return new Proxy(wrappee, {
                get: (target, propertyKey, receiver) => {
                    scene.subscribe(atom);
                    return this.wrapValue(scene, atom, Reflect.get(target, propertyKey));
                },
                set: (target, propertyKey, value, receiver) => {
                    const returnValue = Reflect.set(target, propertyKey, value, receiver);
                    scene.notifyChange(atom);
                    return returnValue;
                },
            });
        }
        return wrappee;
    }
    private wrapMapValue(
        scene: Scene,
        atom: Atom,
        parent: any,
        parentKey: PropertyKey,
        wrappee: any,
    ) {
        if (mapMutatorMethods.includes(parentKey)) {
            scene.notifyChange(atom);
            return wrappee.bind(parent);
        }
        if (mapIteratorMethods.includes(parentKey)) {
            const isPair = parentKey === 'entries' || parentKey === Symbol.iterator;
            return this.wrapIteratorMethod(scene, atom, parent, wrappee, isPair);
        }
        if (typeof wrappee === 'function') {
            return (...args: any[]) => {
                return this.wrapValue(scene, atom, wrappee.apply(parent, args));
            };
        }
        return wrappee;
    }
    private wrapSetValue(
        scene: Scene,
        atom: Atom,
        parent: any,
        parentKey: PropertyKey,
        wrappee: any,
    ) {
        if (setMutatorMethods.includes(parentKey)) {
            scene.notifyChange(atom);
            return wrappee.bind(parent);
        }
        if (setIteratorMethods.includes(parentKey)) {
            const isPair = parentKey === 'entries';
            return this.wrapIteratorMethod(scene, atom, parent, wrappee, isPair);
        }
        if (typeof wrappee === 'function') {
            return (...args: any[]) => {
                return this.wrapValue(scene, atom, wrappee.apply(parent, args));
            };
        }
        return wrappee;
    }
    private wrapIteratorMethod(scene: Scene, atom: Atom, parent: any, wrappee: any, isPair: boolean) {
        const wrap = this.wrapValue.bind(this, scene, atom);
        return () => {
            const innerIterator = wrappee.call(parent);
            return {
                // iterator protocol
                next() {
                    const { value, done } = innerIterator.next();
                    return done
                        ? { value, done }
                        : {
                              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                              done,
                          };
                },
                // iterable protocol
                [Symbol.iterator]() {
                    return this;
                },
            };
        };
    }
    private atom(propertyKey: PropertyKey) {
        let atom = this.atoms.get(propertyKey);
        if (!atom) {
            this.atoms.set(propertyKey, (atom = new ReactiveProp(propertyKey)));
        }
        return atom;
    }
}

class ReactiveProp extends SimpleAtom {
    constructor(public readonly propertyKey: PropertyKey) {
        super();
    }
}
