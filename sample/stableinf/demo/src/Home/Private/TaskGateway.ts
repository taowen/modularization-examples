import { Gateway, Scene } from '@stableinf/io';

export class TaskGateway extends Gateway {
    public static async wasteSomeResource(scene: Scene) {
        console.log(`about to waste some resource ${scene}`)
        const mills = Math.random() * 5000;
        await new Promise((resolve) => setTimeout(resolve, mills));
        if (mills > 1000 && mills < 2000) {
            throw new Error('bad luck');
        }
        return mills;
    }
}
