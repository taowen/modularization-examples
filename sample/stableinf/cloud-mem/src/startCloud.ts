import { Cloud } from '@stableinf/cloud';
import { startObjectStorage } from './startObjectStorage';

export async function startCloud(): Promise<Cloud> {
    return {
        objectStorage: await startObjectStorage(),
    };
}
