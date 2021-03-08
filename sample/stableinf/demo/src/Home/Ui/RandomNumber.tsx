import * as React from 'react';
import { callbackTracker, Widget } from '@stableinf/rx-react';
import { TaskGateway } from '../Private/TaskGateway';
import { Scene } from '@stableinf/io';
import { Ref } from '@stableinf/rx-react';

const fakeTable = new Ref('some fake table');

export class RandomNumber extends Widget {
    private isRetrying = callbackTracker(this);
    private randomNumber = this.subscribe(async (scene) => {
        scene.subscribe(fakeTable);
        return await scene.useServices<typeof TaskGateway>().wasteSomeResource();
    });
    public render() {
        return (
            <div>
                <span>{this.randomNumber}</span>
                {this.isRetrying.value ? (
                    <button disabled>重算中...</button>
                ) : (
                    <button onClick={this.callback('tryAgain')}>重算一次</button>
                )}
            </div>
        );
    }
    public tryAgain = this.isRetrying.track(async (scene: Scene) => {
        scene.notifyChange(fakeTable);
        // notifyChange 触发的页面刷新没有做完，按钮会一直是灰色的
        // 而不是 notifyChange 触发之之后，立马按钮就又可以点了
    });
}
