# 问题

为了支持新的业务，往往需要给 OrderType 这个字段上添加新的订单类型。为了不影响已有的业务，还经常要加 isNewBiz 这样的“Flag”来标识新的业务场景。除了一直加新的Flag，就没别的办法了吗?

# 分析

添加新的 OrderType，是为了有地方可以用 `if (OrderType === 'DirectBuy') {}` 这样的条件判断，然后目的是为了实现差异化的业务逻辑。
我们知道，if/else 都可以用面向对象的继承关系来表达。所以可以用 `DirectBuyOrder extends Order` 来代替这个 if/else 的判断。
但是这么做是行不通的，原因有两条

* 如果又有一个需求是 Vip 用户的订单给个不同的行为，那么就有 VipOrder 和 VipDirectBuyOrder 了。这样扩展下去还不如写 if/else。
* 持久化到数据库之后，要重新加载回来，还是得有一个 OrderType 的字段来判断订单类型才行。

除了继承之外，我们还有一种选择是组合。给订单一个“子单据”列表：

* DirectBuyRecipt
* VipBenefit

新的字段，新的行为添加到这些新加的表里。通过查询订单的“子单据”列表，可以找到这些附加的对象。但是这样会有一个缺陷是，调用 Order 上的行为就麻烦了很多。所以要把这些子单据的查找封装到 Order 的行为里，比如

```ts
function proceedToCheckout() {
    const list = this.listSubEntities();
    for (const subEntity of list) {
        if (subEntity.canHandle('proceedToCheckout')) {
            return subEntity.proceedToCheckout();
        }
    }
    throw new InternalError();
}
```

这样我们就可以用新增子单据的方法，来对 Order 的行为进行扩展，而不用一直扩展 OrderType 了。
为了效率的原因，listSubEntities 新增的查询也是可以避免的。我们可以把子单据的id和类型信息冗余一份到订单上做为“缓存”。
这样在不查询存储的情况下，就可以直接拿订单本身的信息去判断要转发给哪个子单据处理。
这个缓存实质上是对子单据数据的 prefetch，可以和业务逻辑没有任何关系，是一个基础设施的IO优化。