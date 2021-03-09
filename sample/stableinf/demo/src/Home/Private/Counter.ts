import { ActiveRecord, Scene, toInsert, toQuery, toRunMethod } from '@stableinf/io';
import type { BatchSaveCounterDemo } from '../Ui/BatchSaveCounterDemo';

export class Counter extends ActiveRecord {
    public static queryCounters = toQuery(Counter);
    public static insertCounter = toInsert(Counter);
    public static incrementCounter = toRunMethod(Counter, 'increment');
    public static decrementCounter = toRunMethod(Counter, 'decrement');

    // 把前端的 BatchSaveCounterDemo 类型 import 进来当 RPC 协议用
    // 因为只是 import type，并不会要求后端代码里跑 react
    public static async batchSave(scene: Scene, form: BatchSaveCounterDemo) {
        for (const counterForm of form.localCounters) {
            if (counterForm.id) {
                const counter = await scene.get(Counter, counterForm.id);
                Object.assign(counter, { count: counterForm.count });
                await counter.update(scene);
            } else {
                await scene.insert(Counter, { count: counterForm.count });
            }
        }
    }

    public id: string;
    public count = 100;

    public async increment() {
        this.count++;
        await this.update(this.scene);
    }

    public async decrement() {
        this.count--;
        await this.update(this.scene);
    }
}
