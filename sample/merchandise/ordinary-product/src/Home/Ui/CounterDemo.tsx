import * as React from 'react';
import { Widget } from '@autonomy/reactive-widget';
import type { Counter } from '../Private/Counter';
import { Scene } from '@autonomy/entity-archetype';
import { GreetingWordsGateway } from '../Private/GreetingWordsGateway';

export class CounterDemo extends Widget {
    public greetingWords = this.subscribe(async (scene) => {
        return await $(scene).getGreetingWords();
    });
    public counters = this.subscribe(async (scene) => {
        return await $(scene).queryCounters({});
    });

    public render() {
        return (
            <div>
                <h3>{this.greetingWords}</h3>
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
        await $(scene).incrementCounter(counter.id);
    }

    public async decrement(scene: Scene, counter: Counter) {
        await $(scene).decrementCounter(counter.id);
    }

    public async addCounter(scene: Scene) {
        await $(scene).insertCounter({});
    }
}

function $(scene: Scene) {
    return scene.useServices<typeof Counter & typeof GreetingWordsGateway>();
}
