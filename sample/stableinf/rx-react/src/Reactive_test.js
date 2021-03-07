const should = require('./should');
const { Reactive } = require('./Reactive');
const { Future } = require('./Future');

describe('Reactive', () => {
    it(
        'direct set property',
        should('notify change', async (scene) => {
            const obj = new Reactive({ abc: 'hello' }).attachTo(scene);
            const future = new Future(async () => {
                return obj.abc;
            });
            should.eq('hello', await future.get(scene));
            obj.abc = 'world';
            should.eq('world', await future.get(scene));
        }),
    );
    it('does not wrap Date', should('not detect change', async(scene) => {
        const obj = new Reactive({ abc: new Date(1) }).attachTo(scene);
        const future = new Future(async () => {
            return obj.abc.getTime();
        });
        should.eq(1, await future.get(scene));
        obj.abc.setTime(2);
        should.eq(1, await future.get(scene));
    }))
});
