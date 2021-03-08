import { Atom, SimpleAtom, ChangeTracker, Scene } from '@stableinf/io';

const mapMutatorMethods: PropertyKey[] = ['set', 'clear', 'delete'];
const mapIteratorMethods: PropertyKey[] = ['keys', 'values', 'entries', Symbol.iterator];
const setMutatorMethods: PropertyKey[] = ['add', 'clear', 'delete'];
const setIteratorMethods: PropertyKey[] = ['keys', 'values', 'entries', Symbol.iterator];

const rawValue = Symbol.for('rawValue');

// @internal
export class Reactive {
    private atoms = new Map<PropertyKey, Atom>();
    private [rawValue] = this;
    constructor(props?: Record<string, any>) {
        Object.assign(this, props);
    }
    public attachTo(tracker: ChangeTracker) {
        // 避免被 Proxy 包两遍，先把实际的原始值取出来
        const _this = this[rawValue];
        const baseHandler: ProxyHandler<any> = {
            get: (target, propertyKey, receiver) => {
                if (propertyKey === rawValue || propertyKey === 'attachTo') {
                    return Reflect.get(target, propertyKey);
                }
                tracker.subscribe(_this.atom(propertyKey));
                return _this.wrapValue(
                    tracker,
                    _this.atom(propertyKey),
                    Reflect.get(target, propertyKey),
                );
            },
            set: (target, propertyKey, value, receiver) => {
                const returnValue = Reflect.set(target, propertyKey, value, receiver);
                tracker.notifyChange(_this.atom(propertyKey));
                return returnValue;
            },
        };
        return new Proxy(_this, baseHandler);
    }
    private wrapValue(tracker: ChangeTracker, atom: Atom, wrappee: any): any {
        if (typeof wrappee === 'object') {
            if (wrappee instanceof Reactive) {
                // 不要包两遍，Reactive 独立跟踪自己的订阅者
                return wrappee[rawValue];
            } else if (wrappee instanceof Map) {
                return new Proxy(wrappee, {
                    get: (target, propertyKey, receiver) => {
                        return this.wrapMapValue(
                            tracker,
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
                            tracker,
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
                    tracker.subscribe(atom);
                    return this.wrapValue(tracker, atom, Reflect.get(target, propertyKey));
                },
                set: (target, propertyKey, value, receiver) => {
                    const returnValue = Reflect.set(target, propertyKey, value, receiver);
                    tracker.notifyChange(atom);
                    return returnValue;
                },
            });
        }
        return wrappee;
    }
    private wrapMapValue(
        tracker: ChangeTracker,
        atom: Atom,
        parent: any,
        parentKey: PropertyKey,
        wrappee: any,
    ) {
        if (mapMutatorMethods.includes(parentKey)) {
            tracker.notifyChange(atom);
            return wrappee.bind(parent);
        }
        if (mapIteratorMethods.includes(parentKey)) {
            const isPair = parentKey === 'entries' || parentKey === Symbol.iterator;
            return this.wrapIteratorMethod(tracker, atom, parent, wrappee, isPair);
        }
        if (typeof wrappee === 'function') {
            return (...args: any[]) => {
                return this.wrapValue(tracker, atom, wrappee.apply(parent, args));
            };
        }
        return wrappee;
    }
    private wrapSetValue(
        tracker: ChangeTracker,
        atom: Atom,
        parent: any,
        parentKey: PropertyKey,
        wrappee: any,
    ) {
        if (setMutatorMethods.includes(parentKey)) {
            tracker.notifyChange(atom);
            return wrappee.bind(parent);
        }
        if (setIteratorMethods.includes(parentKey)) {
            const isPair = parentKey === 'entries';
            return this.wrapIteratorMethod(tracker, atom, parent, wrappee, isPair);
        }
        if (typeof wrappee === 'function') {
            return (...args: any[]) => {
                return this.wrapValue(tracker, atom, wrappee.apply(parent, args));
            };
        }
        return wrappee;
    }
    private wrapIteratorMethod(
        tracker: ChangeTracker,
        atom: Atom,
        parent: any,
        wrappee: any,
        isPair: boolean,
    ) {
        const wrap = this.wrapValue.bind(this, tracker, atom);
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

export function reactive<T>(initData: T): T & { attachTo(scene: Scene): T } {
    return new Reactive(initData).attachTo(delegatesChnageTracker) as any;
}
reactive.currentChangeTracker = undefined as ChangeTracker | undefined;

// @internal
export const delegatesChnageTracker: ChangeTracker = {
    subscribe(atom) {
        if (!reactive.currentChangeTracker) {
            throw new Error('reactive.currentChangeTracker is undefined, can not read from reactive');
        }
        return reactive.currentChangeTracker.subscribe(atom);
    },
    notifyChange(atom) {
        throw new Error('reactive() can not be modified before attachTo a change tracker')
    }
}

class ReactiveProp extends SimpleAtom {
    constructor(public readonly propertyKey: PropertyKey) {
        super();
    }
}
