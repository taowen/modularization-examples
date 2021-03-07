const should = require('./should');
const { Reactive } = require('./Reactive');
const { Future } = require('./Future');

describe('Reactive / map', () => {
    it(
        'set key',
        should('notify change', async (scene) => {
            const obj = new Reactive({ a: new Map() }).attachTo(scene);
            const future = new Future(async () => {
                return Array.from(obj.a.values()).join(',');
            });
            should.eq('', await future.get(scene));
            obj.a.set('k1', 'v1');
            should.eq('v1', await future.get(scene));
        }),
    );
    it(
        'mutate array hold by map',
        should('notify change', async (scene) => {
            const arr = ['hello'];
            const obj = new Reactive({ a: new Map([['b', arr]]) }).attachTo(scene);
            const future = new Future(async () => {
                return obj.a.get('b').join(',');
            });
            should.eq('hello', await future.get(scene));
            obj.a.get('b').push('world');
            should.eq('hello,world', await future.get(scene));
        }),
    );
});
