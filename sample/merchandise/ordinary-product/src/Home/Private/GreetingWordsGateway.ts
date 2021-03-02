import { Gateway } from "@autonomy/entity-archetype";
import { Scene } from "@autonomy/entity-archetype";

export class GreetingWordsGateway extends Gateway {
  public static async getGreetingWords(scene: Scene) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'hello';
  }
}
