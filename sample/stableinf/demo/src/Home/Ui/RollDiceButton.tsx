import * as React from 'react';
import { callbackTracker, Widget } from '@stableinf/rx-react';
import { Scene } from '@stableinf/io';
import { TaskGateway } from '../Private/TaskGateway';

export class RollDiceButton extends Widget {
    private isRollingDice = callbackTracker(this);

    public render() {
        return this.isRollingDice.value ? (
            <button disabled>摇色子中...</button>
        ) : (
            <button onClick={this.callback('rollDice')}>随便算算</button>
        );
    }

    public rollDice = this.isRollingDice.track(async (scene: Scene) => {
        const luckyNumber = await scene.useServices<typeof TaskGateway>().wasteSomeResource();
        console.log('result', luckyNumber);
    })
}
