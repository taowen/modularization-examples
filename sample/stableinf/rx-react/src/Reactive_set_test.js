const should = require('./should');
const { Reactive } = require('./Reactive');
const { Future } = require('./Future');

describe('Reactive / set', () => {
    it(
        'add member',
        should('notify change', async (scene) => {
            const obj = new Reactive({ a: new Set() }).attachTo(scene);
            const future = new Future(async () => {
                return Array.from(obj.a).join(',');
            });
            should.eq('', await future.get(scene));
            obj.a.add('hello');
            should.eq('hello', await future.get(scene));
        }),
    );
    it(
        'mutate object hold by set',
        should('notify change', async (scene) => {
            const innerObj = {'b': 'hello'};
            const obj = new Reactive({ a: new Set([innerObj]) }).attachTo(scene);
            const innerProxy = Array.from(obj.a)[0];
            const future = new Future(async () => {
                return innerProxy['b'];
            });
            should.eq('hello', await future.get(scene));
            innerProxy['b'] = 'world';
            should.eq('world', await future.get(scene));
        }),
    );
});
