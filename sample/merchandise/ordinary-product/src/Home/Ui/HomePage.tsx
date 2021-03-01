import { Scene } from "@autonomy/entity-archetype";
import { renderWidget, Widget } from "@autonomy/reactive-widget";
import { ProductDetailsPage } from "@motherboard/Sell/Ui/ProductDetailsPage";
import * as React from "react";
import { Greeting } from "./Greeting";

export class HomePage extends Widget {
  public syncData = async (scene: Scene) => {};
  public setupHooks() {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    React.useEffect(() => {
      window.addEventListener("hashchange", forceUpdate);
    });
  }
  public render() {
    if (window.location.hash === "#discrete-ui") {
      return renderWidget(ProductDetailsPage, { productName: "apple" });
    }
    return (
      <div>
        {renderWidget(Greeting)}
        <ul>
          <li>
            <a href="#discrete-ui">离散型 UI</a>
          </li>
        </ul>
      </div>
    );
  }
}
