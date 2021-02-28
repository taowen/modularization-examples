import { Gateway, toQuery } from "@autonomy/entity-archetype";
import { XszkPromotion } from "./XszkPromotion";

export class XszkPromotionGateway extends Gateway {
    public listActiveXszkPromotions =  toQuery(XszkPromotion);
}