import { ActiveRecord, toInsert, toQuery } from '@autonomy/entity-archetype';

export class Counter extends ActiveRecord {
    public static queryCounters = toQuery(Counter);
    public static insertCounter = toInsert(Counter);
    public id: string;
    public count = 100;
}
