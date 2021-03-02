import * as React from 'react';
import { Widget } from '@autonomy/reactive-widget';
import type { Counter } from '../Private/Counter';
import { Scene } from '@autonomy/entity-archetype';

export class CounterDemo extends Widget {
    public counters = this.subscribe(async (scene) => {
        const s = scene.useServices<typeof Counter>();
        return await s.queryCounters({});
    });

    public render() {
        return (
            <div>
                <ul>
                    {this.counters.map((c) => (
                        <li key={c.id}>{c.count}</li>
                    ))}
                </ul>
                <button onClick={this.callback('addCounter')}>新建 counter</button>
            </div>
        );
    }

    public async addCounter(scene: Scene) {
        await scene.useServices<typeof Counter>().insertCounter({});
    }
}
