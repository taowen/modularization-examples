import { Scene } from '@stableinf/io';
import { Ref } from './reactive';
import { bindCallback } from './Widget';

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
