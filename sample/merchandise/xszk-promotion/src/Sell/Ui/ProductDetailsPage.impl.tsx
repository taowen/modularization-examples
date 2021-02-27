import { override, use } from "@autonomy-design-sample/entity-archetype";
import * as React from "react";
import { ProductDetailsPage as INF } from "@motherboard/Sell/Ui/ProductDetailsPage";
import { XszkPromotionGateway } from "../Public/XszkPromotionGateway";

const xszkPromotionGateway = use<XszkPromotionGateway>();

export class ProductDetailsPage extends INF {
  // 缓存所有的折扣活动
  public activeXszkPromotions = xszkPromotionGateway.listActiveXszkPromotions();

  @override
  public renderXszk() {
    for (const promotion of this.activeXszkPromotions) {
      if (promotion.targetProductId === this.props.productId) {
        return <div>限时折扣</div>;
      }
    }
    return <div>无折扣</div>;
  }
}
