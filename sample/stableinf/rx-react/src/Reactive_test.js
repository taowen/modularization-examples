const should = require('./should');
const { Reactive, reactive } = require('./Reactive');
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
    it(
        'does not wrap Date',
        should('not detect change', async (scene) => {
            const obj = new Reactive({ abc: new Date(1) }).attachTo(scene);
            const future = new Future(async () => {
                return obj.abc.getTime();
            });
            should.eq(1, await future.get(scene));
            obj.abc.setTime(2);
            should.eq(1, await future.get(scene));
        }),
    );
    it(
        'read prop from reactive() without current change tracker',
        should('throw exception', async (scene) => {
            const obj = reactive({ a: 'hello' });
            let ex;
            try {
                const b = obj.a;
            } catch (e) {
                ex = e;
            }
            should.eq(true, ex !== undefined);
        }),
    );
    it(
        'read prop from reactive()',
        should('attach to current change tracker', async (scene) => {
            const obj = reactive({ a: 'hello' });
            reactive.currentChangeTracker = scene;
            const future = new Future(async () => {
                return obj.a;
            });
            should.eq('hello', await future.get(scene));
            obj.attachTo(scene).a = 'world';
            should.eq('world', await future.get(scene));
        }),
    );
    it('Reactive inside another Reactive', should('not wrap twice', async (scene) => {
        const r1 = new Reactive({ b: 'hello' });
        const r2 = new Reactive({ a: [r1] }).attachTo(scene);
        const future = new Future(async () => {
            return r2.a[0].b;
        });
        should.eq('hello', await future.get(scene));
        r2.a[0].b = 'world'
        should.eq('hello', await future.get(scene));
    }))
});
