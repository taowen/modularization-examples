import { Gateway } from "@autonomy-design-sample/entity-archetype";

export class GreetingWordsGateway extends Gateway {
  public async getGreetingWords() {
    return 'hello';
  }
}
