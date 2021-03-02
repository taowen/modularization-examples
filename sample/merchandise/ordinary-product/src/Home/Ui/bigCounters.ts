import { Future } from "@autonomy/reactive-widget";
import { Counter } from "../Private/Counter";

// 可以用 Future 来缓存一些跨 widget 的公共数据
export const bigCounters = new Future(async (scene) => {
    const allCounters = await scene.useServices<typeof Counter>().queryCounters();
    const bigCounters = [];
    for (const counter of allCounters) {
        if (counter.count >= 101) {
            bigCounters.push(counter);
        }
    }
    return bigCounters;
})