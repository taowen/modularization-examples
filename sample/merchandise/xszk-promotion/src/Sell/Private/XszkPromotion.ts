import { ActiveRecord, toQuery } from "@autonomy/entity-archetype";

export class XszkPromotion extends ActiveRecord {
    public static listActiveXszkPromotions =  toQuery(XszkPromotion);
    public targetProductName: string;
}