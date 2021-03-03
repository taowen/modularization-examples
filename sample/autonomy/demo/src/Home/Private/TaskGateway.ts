import { Gateway } from '@autonomy/io';

export class TaskGateway extends Gateway {
    public static async wasteSomeResource() {
        const mills = Math.random() * 5000;
        await new Promise((resolve) => setTimeout(resolve, mills));
        if (mills > 1000 && mills < 2000) {
            throw new Error('bad luck');
        }
        return mills;
    }
}
