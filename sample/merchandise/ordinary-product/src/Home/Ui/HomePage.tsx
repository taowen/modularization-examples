import { Widget } from "@autonomy/reactive-widget";
import { ProductDetailsPage } from "@motherboard/Sell/Ui/ProductDetailsPage";
import * as React from "react";
import type { GreetingWordsGateway } from "../Public/GreetingWordsGateway";

export class HomePage extends Widget {
  private get greetingWordsGateway() {
    return this.scene.useSync<GreetingWordsGateway>();
  }
  private words = this.greetingWordsGateway.getGreetingWords();

  public render() {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    React.useEffect(() => {
      window.addEventListener("hashchange", forceUpdate);
    });
    if (window.location.hash === "#discrete-ui") {
      return this.renderWidget(ProductDetailsPage, { productName: "apple" });
    }
    return (
      <div>
        <h1>{this.words}</h1>
        <ul>
          <li>
            <a href="#discrete-ui">离散型 UI</a>
          </li>
        </ul>
      </div>
    );
  }
}
