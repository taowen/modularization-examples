import * as React from 'react';
import { Widget } from '@autonomy/io-react';
import { TaskGateway } from '../Private/TaskGateway';
import { Scene } from '@autonomy/io';

export class RandomNumber extends Widget {
    private isRetrying = this.isExecuting('tryAgain');
    private randomNumber = this.subscribe(async (scene) => {
        scene.subscribe('some fake table');
        return await scene.useServices<typeof TaskGateway>().wasteSomeResource();
    });
    public render() {
        return (
            <div>
                <span>{this.randomNumber}</span>
                {this.isRetrying ? (
                    <button disabled>重算中...</button>
                ) : (
                    <button onClick={this.callback('tryAgain')}>重算一次</button>
                )}
            </div>
        );
    }
    public async tryAgain(scene: Scene) {
        scene.notifyChange('some fake table');
    }
}
