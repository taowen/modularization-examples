import { Scene } from '@autonomy/entity-archetype';
import { Widget } from '@autonomy/reactive-widget';
import * as React from 'react';
import type { GreetingWordsGateway } from '../Private/GreetingWordsGateway';

function $(scene: Scene) {
    return scene.useServices<typeof GreetingWordsGateway>();
}

export class Greeting extends Widget {
    private words = this.subscribe(async (scene) => {
        return await $(scene).getGreetingWords();
    });

    public render() {
        return <h1>{this.words}</h1>;
    }
}