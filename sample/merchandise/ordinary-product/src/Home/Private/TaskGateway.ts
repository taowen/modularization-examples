import { Gateway } from '@autonomy/io';

export class TaskGateway extends Gateway {
    public static async wasteSomeResource() {
        const mills = Math.random() * 5000;
        if (mills < 1000) {
            throw new Error('bad luck');
        }
        await new Promise((resolve) => setTimeout(resolve, mills));
        return mills;
    }
}
