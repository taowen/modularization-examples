# Part.1 代码防腐

我们首先来明确什么样的代码是“好”的：

* [度量 Autonomy 的指标](./AutonomyMetrics.md)
* [度量 Consistency 的指标](./ConsistencyMetrics.md)

但是要保持代码是“好”的状况很难。代码腐化似乎注定的

* 最初：没有谁是不想好好写的。都有一个宏伟的规划，这次一定
* 途中：Code Review 如同“堂吉诃德”一般，根本架不住大批量大批量的修改
* 放弃：躺平了，下次一定

如此循环往复。腐化了之后，无法起死回生的。

* 食品防腐是 low tech 的事情，但是中毒身亡之后起死回生是天顶星技术
* 新冠疫苗已经被人类掌握，但是免疫风暴造成的多脏器衰竭仍然是天顶星技术

虽然很多人醉心于遗留代码改造之道。笔者也从事铲屎业务很多年，仍未掌握此项技术。
还是让代码一直保持在未腐化的状态更简单一些。那么代码如何防腐呢？不靠 Code Review 又靠什么呢？

* [对策1：信息隐藏](./InformationHiding.md)
  * [依赖倒置的各种实现方式](./DependencyInversion/README.md)
  * [各种需求下都有哪些常规拆法？](./Integration/README.md)
    * [需求模式：离散型UI](./Integration/DiscreteUI/README.md)
    * [需求模式：混合型UI](./Integration/MixedUI/README.md)
    * [需求模式：离散型流程](./Integration/DiscreteProcess/README.md)
    * [需求模式：混合型流程](./Integration/MixedProcess/README.md)
    * [需求模式：产品族](./Integration/ProductFamily/README.md)
    * [需求模式：领先技术](./Integration/Library/README.md)
  * [亚马逊的下单流程](./Integration/AmazonExample/README.md)
* [对策2：持续改进](./Consensus.md)