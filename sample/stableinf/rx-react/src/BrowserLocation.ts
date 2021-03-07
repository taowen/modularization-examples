import { ActiveRecord, Scene } from '@stableinf/io';
import { bindCallback } from './Widget';

export class BrowserLocation extends ActiveRecord {
    public hash: string;

    public static async startSyncing(scene: Scene) {
        await scene.insert(BrowserLocation, { hash: window.location.hash });
        window.addEventListener(
            'hashchange',
            bindCallback('onHashChanged', async (scene: Scene) => {
                const browserLocation = await scene.get(BrowserLocation);
                await browserLocation.updateHash(scene, window.location.hash);
            }),
        );
    }

    public async updateHash(scene: Scene, newHash: string) {
        this.hash = newHash;
        await this.update(scene);
    }
}
