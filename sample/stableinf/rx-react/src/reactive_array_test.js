const should = require('./should');
const { reactive } = require('./reactive');
const { Future } = require('./Future');

describe('Reactive / array', () => {
    it(
        'push element',
        should('notify change', async (scene) => {
            const obj = reactive({ a: ['first'] }).attachTo(scene);
            const future = new Future(async () => {
                return obj.a.length;
            });
            should.eq(1, await future.get(scene));
            obj.a.push('second');
            should.eq(2, await future.get(scene));
        }),
    );
    it(
        'iterate',
        should('still work', async (scene) => {
            const obj = reactive({ a: [1, 2, 3] }).attachTo(scene);
            let total = 0;
            for (const elem of obj.a) {
                total += elem;
            }
            should.eq(6, total);
        }),
    );
    it(
        'reset length',
        should('notify change', async (scene) => {
            const obj = reactive({ a: ['first', 'second'] }).attachTo(scene);
            const future = new Future(async () => {
                return obj.a[0];
            });
            should.eq('first', await future.get(scene));
            obj.a.length = 0;
            should.eq(undefined, await future.get(scene));
        }),
    );
});
