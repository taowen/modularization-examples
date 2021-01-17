我们担心这样的症状：

* 重复：改一下RPC重试策略，需要把所有调用RPC的地方都改一遍
* 不一致：一个APP有4中不同的 date picker 组件，做的都是选日期这个事情
* 不知道该抄谁：要做一个新界面了，发现类似的界面布局有用 css flexbox 的，有用 grid 的，也有自己拿 margin 算的

Consistency 的愿景是尽量减轻上述的症状，让实现更一致。从而使得需求中的一致性可以很好地被落实到实现代码里，也通过复用减少了工作量。

需要注意的是，我选择的词汇是 Consistency 而非 Reuse。不 Reuse 未必是问题，但是不 Consistent 很有可能是问题。
当我们从代码出发去追求 Reuse 的时候，容易跑偏方向，为了 Reuse 而 Reuse。
当我们从需求出发，去审视每一个不 Consistent 的地方，这些 Inconsistence 是必要的吗，创造了独特业务价值吗？这样的追问更容易让所有人对目标达成一致。

那么根据过往经验，常见的 Consistency [场景](./Scenario.md)有哪些呢？

我们又如何能度量在 Consistency 这个维度，现在的问题有多严重。或者换句话说，当我们做出了一些改进，如何[度量](./ConsistencyMetrics.md)有改善呢?