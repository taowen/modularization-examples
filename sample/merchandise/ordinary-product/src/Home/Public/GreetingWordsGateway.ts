import { Gateway } from "@autonomy/entity-archetype";
import { Scene } from "@autonomy/entity-archetype";

export class GreetingWordsGateway extends Gateway {
  public async getGreetingWords(scene: Scene) {
    return 'hello';
  }
}
