import { Gateway } from "@autonomy-design-sample/entity-archetype";
import { Scene } from "@autonomy-design-sample/entity-archetype";

export class GreetingWordsGateway extends Gateway {
  public async getGreetingWords(scene: Scene) {
    return 'hello';
  }
}
