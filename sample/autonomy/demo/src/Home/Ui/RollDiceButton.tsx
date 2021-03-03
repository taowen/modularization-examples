import * as React from 'react';
import { Widget } from '@autonomy/io-react';
import { Scene } from '@autonomy/io';
import { TaskGateway } from '../Private/TaskGateway';

export class RollDiceButton extends Widget {
    private isRollingDice = this.isExecuting('rollDice');

    public render() {
        return this.isRollingDice ? (
            <button disabled>摇色子中...</button>
        ) : (
            <button onClick={this.callback('rollDice')}>随便算算</button>
        );
    }

    public async rollDice(scene: Scene) {
        const luckyNumber = await scene.useServices<typeof TaskGateway>().wasteSomeResource();
        console.log('result', luckyNumber);
    }
}
