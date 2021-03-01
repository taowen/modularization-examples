import { Widget } from "@autonomy/reactive-widget";
import * as React from "react";
import type { GreetingWordsGateway } from "../Public/GreetingWordsGateway";

export class Greeting extends Widget {
  private words = this.future(async (scene) => {
    const gateway = scene.useGateway<GreetingWordsGateway>();
    return await gateway.getGreetingWords();
  });

  public render() {
    return <h1>{this.words}</h1>;
  }
}
