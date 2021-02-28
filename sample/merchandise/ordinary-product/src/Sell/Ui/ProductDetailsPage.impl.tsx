import { override } from "@autonomy/entity-archetype";
import * as React from "react";
import { ProductDetailsPage as INF } from "@motherboard/Sell/Ui/ProductDetailsPage";
import type { ProductGateway } from "../Public/ProductGateway";

export class ProductDetailsPage extends INF {
  private get productGateway() {
    return this.scene.useGateway<ProductGateway>();
  }

  // 每个 Widget 片段自己通过 rpc 去拿自己要的数据
  private theProduct = this.productGateway.loadProduct({
    name: this.props.productName,
  });

  @override
  public renderProductBasics() {
    return <div>product name: {this.theProduct.name}</div>;
  }
}
