import { Gateway } from "@autonomy/io";
import { Scene } from "@autonomy/io";

export class GreetingWordsGateway extends Gateway {
  public static async getGreetingWords(scene: Scene) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'hello';
  }
}
