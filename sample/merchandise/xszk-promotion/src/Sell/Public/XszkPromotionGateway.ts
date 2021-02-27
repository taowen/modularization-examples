import { Gateway } from "@autonomy-design-sample/entity-archetype";
import { XszkPromotion } from "./XszkPromotion";

export class XszkPromotionGateway extends Gateway {
    public listActiveXszkPromotions(): XszkPromotion[] {
        return [];
    }
}