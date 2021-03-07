import { Atom, AtomSubscriber, Operation, Scene, SimpleAtom } from '@stableinf/io';

export class Reactive {
    private atoms = new Map<PropertyKey, Atom>();
    constructor(props?: Record<string, any>) {
        Object.assign(this, props);
    }
    public attachTo(scene: Scene) {
        const baseHandler: ProxyHandler<any> = {
            get: (target, propertyKey, receiver) => {
                scene.subscribe(this.atom(propertyKey));
                return Reflect.get(target, propertyKey);
            },
            set: (target, propertyKey, value, receiver) => {
                const returnValue = Reflect.set(target, propertyKey, value, receiver);
                scene.notifyChange(this.atom(propertyKey));
                return returnValue;
            },
        };
        return new Proxy(this, baseHandler);
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
