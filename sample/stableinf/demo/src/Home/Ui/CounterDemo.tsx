import * as React from 'react';
import { Widget } from '@stableinf/io-react';
import { Scene } from '@stableinf/io';
import { bigCounters } from './bigCounters';
import type { Counter } from '../Private/Counter';
import type { GreetingWordsGateway } from '../Private/GreetingWordsGateway';

function $(scene: Scene) {
    return scene.useServices<typeof Counter & typeof GreetingWordsGateway>();
}

export class CounterDemo extends Widget {
    public greetingWords = this.subscribe(async (scene) => {
        return await $(scene).getGreetingWords();
    });
    public remoteData = this.subscribe(async (scene) => {
        return {
            counters: await $(scene).queryCounters({}),
            bigCounters: await bigCounters.get(scene),
        };
    });

    public render() {
        return (
            <div>
                <h3>{this.greetingWords}</h3>
                <span>大 counter 数量: {this.remoteData.bigCounters.length}</span>
                <ul>
                    {this.remoteData.counters.map((c) => (
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
