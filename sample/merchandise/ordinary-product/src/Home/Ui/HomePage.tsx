import {
  renderWidget,
  use,
  Widget,
} from "@autonomy-design-sample/entity-archetype";
import { ProductDetailsPage } from "@motherboard/Sell/Ui/ProductDetailsPage";
import * as React from "react";
import type { GreetingWordsGateway } from "../Public/GreetingWordsGateway";

const greetingWordsGateway = use<GreetingWordsGateway>();

export class HomePage extends Widget {
  private words = greetingWordsGateway.getGreetingWords();

  public render() {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    React.useEffect(() => {
      window.addEventListener("hashchange", forceUpdate);
    });
    if (window.location.hash === "#discrete-ui") {
      return renderWidget(ProductDetailsPage, { productId: "123" });
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