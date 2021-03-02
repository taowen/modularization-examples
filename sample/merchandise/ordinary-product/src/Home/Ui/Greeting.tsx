import { Widget } from '@autonomy/reactive-widget';
import * as React from 'react';
import type { GreetingWordsGateway } from '../Private/GreetingWordsGateway';

export class Greeting extends Widget {
    private words = this.subscribe(async (scene) => {
        const s = scene.useServices<typeof GreetingWordsGateway>();
        return await s.getGreetingWords();
    });

    public render() {
        return <h1>{this.words}</h1>;
    }
}
