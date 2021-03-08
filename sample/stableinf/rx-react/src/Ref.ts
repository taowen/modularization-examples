import { Atom, SimpleAtom } from '@stableinf/io';
import { delegatesChnageTracker } from './Reactive';

// 和 vue3 的 Ref 类似，是响应式的单个值
// @internal
export class Ref<T = any> extends SimpleAtom {
    constructor(private value: T) {
        super();
    }

    public set(newVal: T, changeTracker?: { notifyChange(atom: Atom): void }) {
        this.value = newVal;
        (changeTracker || delegatesChnageTracker).notifyChange(this);
    }
    
    public get(changeTracker?: { subscribe(atom: Atom): void }) {
        (changeTracker || delegatesChnageTracker).subscribe(this);
        return this.value;
    }
}
