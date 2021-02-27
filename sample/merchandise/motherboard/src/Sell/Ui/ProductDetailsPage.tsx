import { Widget } from "@autonomy-design-sample/entity-archetype";
import * as React from "react";

export class ProductDetailsPage extends Widget {

  constructor(public props: { productId: string}) {
    super();
  }

  public render(a: string) {
    const ProductBasics = this.renderProductBasics.bind(this);
    const Xszk = this.renderXszk.bind(this);
    return (
      <div>
        <ProductBasics />
        <Xszk />
      </div>
    );
  }

  public renderProductBasics() {
    return <></>;
  }

  public renderXszk() {
    return <></>;
  }
}
