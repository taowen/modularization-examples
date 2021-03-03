import { ActiveRecord, toInsert, toQuery, toRunMethod } from '@autonomy/io';

export class Counter extends ActiveRecord {
    public static queryCounters = toQuery(Counter);
    public static insertCounter = toInsert(Counter);
    public static incrementCounter = toRunMethod(Counter, 'increment');
    public static decrementCounter = toRunMethod(Counter, 'decrement');

    public id: string;
    public count = 100;

    public increment() {
        this.count++;
        this.update();
    }

    public decrement() {
        this.count--;
        this.update();
    }
}
