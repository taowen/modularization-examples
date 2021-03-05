import { ActiveRecord, toQuery } from "@stableinf/io";

export class XszkPromotion extends ActiveRecord {
    public static listActiveXszkPromotions =  toQuery(XszkPromotion);
    public targetProductName: string;
}