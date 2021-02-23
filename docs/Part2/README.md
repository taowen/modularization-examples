# Part.2 只对自己写的代码负责

这个 Part 我们主要讨论如何拆分进程的事情。标题是“只对自己写的代码负责”，这里包含了两个关键词：

* 负责：开发者应该对自己的线上服务负责，也就是所谓的 devops。而不是写好了代码之后，甩给运维去管。不仅仅要自己发布变更，也要接告警，定位问题。
* 自己写的：搞别人的代码是很烦躁的，无论是发布变更，还是告警定位，我们都希望能快速验证自己写的代码是不是有问题，然后把锅甩出去。

要达到“只对自己写的代码负责”是非常高的追求，需要很强的基础设施的支撑。我们经常会抱怨单元测试不好做，线上bug无法复现之类的问题。

## 微服务

微服务的起源是 devops 运动。鼓励 dev 拥有自己的线上服务，dev 自己来做 ops 的工作从而减少沟通成本。
毫无疑问，微服务的合理性并不是从 Autonomy 或者 Consistency 出发，而是以 Feedback 为主要的出发点。

当一个 7*24 的互联网高并发应用稳定性成问题的时候，最合理的做法是什么？据 Google SRE 统计，线上70%的故障都是由某种变更而触发的。
控制变更的速度，尽量延长灰度发布的时间是最重要的事情。
如果变更的粒度只有进程，而进程又只有一个，势必上线的队列会过长。
此时拆分微服务就是延长灰度发布时间最有效的手段。
同时让每个 dev 直接负责线上服务的稳定性告警，可以极大加快故障的定位和处置速度。

那么是不是拆分进程一时爽，一直拆分一直爽呢？
很多过度使用微服务的分布式系统无一例外地遇到了严重的 Feedback 问题。
难道应该是强调一个业务就应该由一个团队端到端负责，重新打起 Monolith 的大旗吗？
这其实就等价于说，怎么分技术的进程，应该取决于业务部门的组织架构。
但是业务部门的组织架构也是三天两头调整的。就是技术部门想要跟着调，业务部门每调整一次，集群就完全重部署一次SRE也不会同意的。

那么怎么拆分进程才是合理的呢？为什么这么拆就是合理的呢？

## 拆分进程的目标

在讨论应该如何去拆之前，我们先来看一下[进程拆分不好导致的症状，以及度量 Feedback 维度做得如何的指标](./FeedbackMetrics.md)。

## 发布变更，告警定位该如何做？

只对自己写的代码负责要体现在发布变更，告警定位这两个环节里。

* [发布变更](./ControlChange.md)：变更之前可以工作，加入了我的变更之后不工作了，那就是我的变更引起的问题。如果不能有效地隔离自己的变更，就要被迫去处理别人写的代码。
    * [多进程](./MultiProcess/README.md)：把单体进程切分成多进程。一次只变更其中的一个。
    * [多租户](./MultiTenancy/README.md)：把所有的业务数据分成租户。一次只升级一个租户的数据和代码。
    * [多变种](./MultiVariant/README.md)：分租户还是粒度太粗了，比如说挂掉一个城市也是不可接受的。那么可以在线上同时运行多个版本的代码，然后逐步的切流量。
* [告警定位](./ControlBoundary.md)：接到告警了如何能快速定位到问题。其核心就是需要在你的代码和别人的代码之间有统一方式定义的边界。不需要知道边界里面的代码是怎么写的，只要看一眼边界上的监控数据就能快速排除不是自己的问题。然后把锅甩出去。
    * [进程边界](./ProcessBoundary/README.md)
    * [函数边界](./FunctionBoundary/README.md)
    * [插件边界](./PluginBoundary/README.md)

## 拆进程不是唯一选择，应该 Autonomy 优先

回到微服务应该怎么拆分，多少个进程是合理的。
相比 [ProcessBoundary](./ProcessBoundary/README.md)，我认为控制好 [FunctionBoundary](./FunctionBoundary/README.md) 和 [PluginBoundary](./PluginBoundary/README.md) 更有利于 Feedback。
相比 [MultiProcess](./MultiProcess/README.md)，我认为一开始就设计好 [MultiTenancy](./MultiTenancy/README.md) 和 [MultiVariant](./MultiVariant/README.md) 更有利于 Feedback。
进程之所以好用是因为开源社区提供了很完善的基础设施。所以我们习惯了迁就于已有的技术设施，来切分进程以利用上这些现成的设施。
从而因为进程的切分来影响我们对Git仓库和团队的切分。

如果能够做好 [FunctionBoundary](./FunctionBoundary/README.md)，[PluginBoundary](./PluginBoundary/README.md)，[MultiTenancy](./MultiTenancy/README.md) 以及 [MultiVariant](./MultiVariant/README.md)，怎么分进程根本就不是一个问题。
所有的代码都跑在一个进程内，一样可以把 Feedback 做得很好。
那微服务的拆分，其实就等价于Git仓库的拆分，也就是 Autonomy 章节中讨论的问题，怎么拆团队拆Git仓库的问题。
其主旨原则就一条：拆分之后，接口的定义要稳定，不要天天修改，导致频繁的跨团队强协作。我们也对怎么量化这个原则给出了指标计算的方法。

所以 [Autonomy](../Part1/AutonomyMetrics.md) 优先，[Feedback](./FeedbackMetrics.md) 的问题，交给基础架构部门通过改进基础设施来解决。