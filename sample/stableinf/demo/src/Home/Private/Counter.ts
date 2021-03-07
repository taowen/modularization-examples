import { ActiveRecord, toInsert, toQuery, toRunMethod } from '@stableinf/io';

export class Counter extends ActiveRecord {
    public static queryCounters = toQuery(Counter);
    public static insertCounter = toInsert(Counter);
    public static incrementCounter = toRunMethod(Counter, 'increment');
    public static decrementCounter = toRunMethod(Counter, 'decrement');

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
