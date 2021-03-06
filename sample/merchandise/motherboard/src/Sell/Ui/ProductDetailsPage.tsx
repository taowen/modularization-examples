import { Widget } from "@stableinf/rx-react";
import * as React from "react";

export class ProductDetailsPage extends Widget {

  public props: { productName: string};

  // 把商品详情页拆分成两个片段
  public render() {
    return (
      <div>
        {this.renderProductBasics()}
        <hr/>
        {this.renderXszk()}
      </div>
    );
  }

  /** 
   * 留给 ordinary-product 去实现
   * @virtual
   */
  public renderProductBasics() {
    return <></>;
  }

  /** 
   * 留给 xszk-promotion 去实现
   * @virtual
   */
  public renderXszk() {
    return <></>;
  }
}
