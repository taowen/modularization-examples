const should = require('./should');
const { Reactive } = require('./Reactive');
const { Future } = require('./Future');

describe('Reactive / object', () => {
    it(
        'set property',
        should('notify change', async (scene) => {
            const obj = new Reactive({ a: { b: 'hello' } }).attachTo(scene);
            const future = new Future(async () => {
                return obj.a.b;
            });
            should.eq('hello', await future.get(scene));
            obj.a.b = 'world';
            should.eq('world', await future.get(scene));
        }),
    );
    it(
        'assign property',
        should('notify change', async (scene) => {
            const obj = new Reactive({ a: { b: 'hello' } }).attachTo(scene);
            const future = new Future(async () => {
                return obj.a.b;
            });
            should.eq('hello', await future.get(scene));
            Object.assign(obj.a, { b: 'world' });
            should.eq('world', await future.get(scene));
        }),
    );
});
