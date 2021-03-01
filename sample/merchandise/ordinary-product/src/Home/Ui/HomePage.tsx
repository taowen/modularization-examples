import { Widget } from "@autonomy/reactive-widget";
import { ProductDetailsPage } from "@motherboard/Sell/Ui/ProductDetailsPage";
import * as React from "react";
import { Greeting } from "./Greeting";

export class HomePage extends Widget {
  public setup() {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    React.useEffect(() => {
      window.addEventListener("hashchange", forceUpdate);
    });
  }
  public render() {
    if (window.location.hash === "#discrete-ui") {
      return this.renderWidget(ProductDetailsPage, { productName: "apple" });
    }
    return (
      <div>
        {this.renderWidget(Greeting)}
        <ul>
          <li>
            <a href="#discrete-ui">离散型 UI</a>
          </li>
        </ul>
      </div>
    );
  }
}
