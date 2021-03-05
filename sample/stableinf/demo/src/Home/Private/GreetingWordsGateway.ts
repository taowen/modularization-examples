import { Gateway } from "@stableinf/io";
import { Scene } from "@stableinf/io";

export class GreetingWordsGateway extends Gateway {
  public static async getGreetingWords(scene: Scene) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'hello';
  }
}
