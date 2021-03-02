import * as React from 'react';
import { Widget } from '@autonomy/reactive-widget';
import type { Counter } from '../Private/Counter';
import { Scene } from '@autonomy/entity-archetype';

export class CounterDemo extends Widget {
    public counters = this.subscribe(async (scene) => {
        return await s(scene).queryCounters({});
    });

    public render() {
        return (
            <div>
                <ul>
                    {this.counters.map((c) => (
                        <li key={c.id}>
                            <button onClick={this.callback('decrement', c)}>-</button>
                            {c.count}
                            <button onClick={this.callback('increment', c)}>+</button>
                        </li>
                    ))}
                </ul>
                <button onClick={this.callback('addCounter')}>新建 counter</button>
            </div>
        );
    }

    public async increment(scene: Scene, counter: Counter) {
        await s(scene).incrementCounter(counter.id);
    }

    public async decrement(scene: Scene, counter: Counter) {
        await s(scene).decrementCounter(counter.id);
    }

    public async addCounter(scene: Scene) {
        await s(scene).insertCounter({});
    }
}

function s(scene: Scene) {
    return scene.useServices<typeof Counter>();
}
