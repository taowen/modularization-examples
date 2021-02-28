import { override } from "@autonomy/entity-archetype";
import * as React from "react";
import { ProductDetailsPage as INF } from "@motherboard/Sell/Ui/ProductDetailsPage";
import { XszkPromotionGateway } from "../Public/XszkPromotionGateway";

export class ProductDetailsPage extends INF {

  private get xszkPromotionGateway() {
    return this.scene.useSync<XszkPromotionGateway>();
  }
  // 缓存所有的折扣活动
  public activeXszkPromotions = this.xszkPromotionGateway.listActiveXszkPromotions();

  @override
  public renderXszk() {
    for (const promotion of this.activeXszkPromotions) {
      if (promotion.targetProductName === this.props.productName) {
        return <div>限时折扣</div>;
      }
    }
    return <div>无折扣</div>;
  }
}
