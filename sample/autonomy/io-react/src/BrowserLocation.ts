import { ActiveRecord, Scene } from '@autonomy/io';
import { bindCallback } from './Widget';

export class BrowserLocation extends ActiveRecord {
    public hash: string;

    public static async startSyncing(scene: Scene) {
        await scene.insert(BrowserLocation, { hash: window.location.hash });
        window.addEventListener(
            'hashchange',
            bindCallback('onHashChanged', async (scene) => {
                const browserLocation = await scene.get(BrowserLocation);
                browserLocation.hash = window.location.hash;
                await scene.update(browserLocation);
            }),
        );
    }
}
