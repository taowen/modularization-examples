import { Scene } from '@stableinf/io';
import { bindCallback } from './Widget';
import { Ref } from './Ref';

export let rxLocation: Ref<string> | undefined;

export function getLocationHash() {
    if (!rxLocation) {
        rxLocation = new Ref(window.location.hash);
        window.addEventListener(
            'hashchange',
            bindCallback('onHashChanged', async (scene: Scene) => {
                rxLocation!.set(window.location.hash, scene);
            }),
        );
    }
    return rxLocation.get();
}
