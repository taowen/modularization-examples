import { ActiveRecord, toQuery } from "@autonomy/io";

export class XszkPromotion extends ActiveRecord {
    public static listActiveXszkPromotions =  toQuery(XszkPromotion);
    public targetProductName: string;
}