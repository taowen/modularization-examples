# 熟知需求模式的意义

* 抽象的A、B、C这样的描述是没有代入感的。遇到实际的业务逻辑，仍然不知道怎么拆解。
* 在实际的业务实现过程中，经常发现 Autonomy 的反模式。这些反面例子比正面例子更有教育意义。
* 书本上理想化的说教经常没法套入产品经理乱七八糟的需求里。我不仅仅需要看上去美的小例子，也要有一些实现起来其实挺难受的恶心例子。

产品经理很少会从 Autonomy 的角度去思考问题，更多是从整体效果的角度来看。
拆分是因为"没法把实现都写一起"，这个现实约束引起的副作用，是产品经理无法感知的实现细节。
产品经理和开发者的常见矛盾就在于一方从整体效果出发，而另外一方则从拆分出的细节出发。
熟知需求模式，是为了把纷繁复杂的需求，往有限的模式里套。
当套不进去的时候，思考一下这个地方做得这么特殊有什么特别的收益吗？

开发者经常陷入的一个误区是从名词出发。比如在应用 Domain Driven Design 的时候，会去想什么叫“商品”呢？
一个名词什么都不是，又可以什么都是。
纠结一个词是什么意思，毫无意义。
我们的目标是实现业务逻辑，把业务逻辑做好拆分。这些业务逻辑的外在表现才真正定义了什么叫“商品”，什么叫“线索”，什么叫“工单”。
常见的外在表现不外乎 UI 长什么，流程是什么。所以我们来具体看看常见的 UI 和流程需求怎么能从 Autonomy 的角度拆好：

* [离散型 UI](./DiscreteUI/README.md)
* [混合型 UI](./MixedUI/README.md)
* [离散型流程](./DiscreteProcess/README.md)
* [混合型流程](./MixedProcess/README.md)
* [产品族](./ProductFamily/README.md)
* [领先技术](./Library/README.md)