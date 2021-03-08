import { Widget } from '@stableinf/rx-react';
import * as React from 'react';

export class LocalCounterDemo extends Widget {
    private count = 0;
    public render() {
        return (
            <div>
                <button onClick={this.callback('decrement')}>-</button>
                {this.count}
                <button onClick={this.callback('increment')}>+</button>
            </div>
        );
    }
    public increment() {
        this.count++;
    }
    public decrement() {
        this.count--;
    }
}
