import * as React from 'react';
import { Widget } from "@autonomy/reactive-widget";
import { Scene } from '@autonomy/entity-archetype';
import type { TaskGateway } from '../Private/TaskGateway';

function $(scene: Scene) {
    return scene.useServices<typeof TaskGateway>();
}

export class TaskListItem extends Widget {
    public luckyNumber = this.subscribe(async (scene) => {
        return await $(scene).wasteSomeResource();
    })
    public render() {
        return <span>{this.luckyNumber}</span>
    }
}