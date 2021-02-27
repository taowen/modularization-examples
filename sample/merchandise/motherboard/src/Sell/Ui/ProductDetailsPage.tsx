import { Widget } from "@autonomy-design-sample/entity-archetype";
import * as React from "react";

export class ProductDetailsPage extends Widget {

  constructor(public props: { productId: string}) {
    super(props);
  }

  // 把商品详情页拆分成两个片段
  public render() {
    const ProductBasics = this.renderProductBasics.bind(this);
    const Xszk = this.renderXszk.bind(this);
    return (
      <div>
        <ProductBasics />
        <hr/>
        <Xszk />
      </div>
    );
  }

  // 留给 ordinary-product 去实现
  public renderProductBasics() {
    return <></>;
  }

  // 留给 xszk-promotion 去实现
  public renderXszk() {
    return <></>;
  }
}