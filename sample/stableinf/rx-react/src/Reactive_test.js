const should = require('./should');
const { Reactive } = require('./Reactive');
const { Future } = require('./Future');

describe('Reactive', () => {
    it(
        'direct set property',
        should('notify change', async (scene) => {
            let obj = new Reactive({ abc: 'hello' });
            obj = obj.attachTo(scene);
            const future = new Future(async () => {
                return obj.abc;
            });
            should.eq('hello', await future.get(scene));
            obj.abc = 'world';
            should.eq('world', await future.get(scene));
        }),
    );
});
