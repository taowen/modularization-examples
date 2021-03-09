import { newOperation, Scene } from '@stableinf/io';
import { renderWidget, Widget } from '@stableinf/rx-react';
import * as React from 'react';
import type { Counter } from '../Private/Counter';

function $(scene: Scene) {
    return scene.useServices<typeof Counter>();
}

let idGen = 1;

export class BatchSaveCounterDemo extends Widget {
    private localCounters: LocalCounter[] = [
        new LocalCounter({ unsaved: `unsaved-${idGen++}`, count: 3 }),
        new LocalCounter({ unsaved: `unsaved-${idGen++}`, count: 1 }),
    ];
    public onMount = async (scene: Scene) => {
        const counters = await $(scene).queryCounters();
        for (const counter of counters) {
            this.localCounters.push(new LocalCounter(counter));
        }
    }
    public render() {
        return (
            <div>
                <ul>
                    {this.localCounters.map((c) => (
                        <React.Fragment key={c.props.unsaved || c.props.id}>
                            {renderWidget(c)}
                        </React.Fragment>
                    ))}
                </ul>
                <button onClick={this.callback('addCounter')}>新建 counter</button>
                <button onClick={this.callback('batchSave')}>保存</button>
            </div>
        );
    }

    public addCounter() {
        this.localCounters.push(new LocalCounter({ unsaved: `unsaved-${idGen++}`, count: 0 }));
    }

    public async batchSave(scene: Scene) {
        console.log(JSON.stringify(this));
    }
}

type LocalCounterProps = Partial<Counter> & { unsaved?: string };

class LocalCounter extends Widget<LocalCounterProps> {
    public readonly id: string;
    private count: number;
    constructor(props: LocalCounterProps) {
        super(props);
        Object.assign(this, props);
    }
    public render() {
        return (
            <li>
                <button onClick={this.callback('decrement')}>-</button>
                {this.count}
                <button onClick={this.callback('increment')}>+</button>
            </li>
        );
    }
    public decrement() {
        this.count--;
        this.notifyChange(newOperation('hahah'))
    }
    public increment() {
        this.count++;
    }
}
