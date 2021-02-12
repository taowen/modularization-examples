# 症状

如果没有做好业务逻辑拆分，可能在项目晚期造成以下三种问题：

* 拆了微服务之后做一个需求要拉很多人，代码写进来了就再也删不掉了
* 要么放任自流，1个App里有4种日期选择方式。要么用力过猛，抽象出来的营销接口动辄几百个参数
* 线上出了问题很难定位到谁引起的，本地做不了任何有意义的测试，反馈周期特别长

为何随机选择了这三种问题并归纳为业务逻辑拆分问题呢? 因为我认为以上三种问题都是由同一个不易变化的本质约束所造成。这个本质约束就是人类的感知与沟通速度是很慢的。
所谓业务架构，其实质就是想尽一切办法减少沟通。只有沟通少，效率才会高，质量才会好。就是这么简单的一件事情。

# 代码腐化

没有哪份代码一开始是不想好好写的。大家在开始落笔之前都知道会出现上述三种症状，并且都自认为做好了设计去避免这些问题。然而往往事情的发展不是如自己所想的那样。我们可能会把代码腐化归咎于自己不够努力，或者需求太多了做得太匆忙。如果当初更用心一点就不会这样。是吗？

如果你带了一个新人，他可能会问你“我这个需求的代码应该写在哪个Git仓库里？”。然后你会根据你的直觉做出一个判断。这种高度依赖于某个人“我觉得”的决策模式是长久不了的。只要摆放代码严重依赖于某个人的判断，腐化就是无法阻挡的趋势。那有没有什么办法可以像“防腐剂”那样，在一开始的时候放进去，然后就可以保持很长时间的“新鲜”呢？

实现方案也不复杂，代码分成两部分。可以随便乱写的，和不能随便乱写的，这两部分。不知道“组合代替继承”的小朋友，只能在可以随便乱写的那部分里发挥。如果大部分代码量都在“可以随便乱写”的那部分里，那么只要很少的人就可以看住“不可随便乱写”的那部分。

说简单也不简单，怎么做到呢？

# 你说的东西可以落地吗?

大部分人的日常工作都是维护一个已有的项目，没有几个人能够参与到 Greenfield 项目的初始设计阶段。这也是大部分读者所懊恼的地方，“我读你的东西有什么用，我这项目就已经烂成了这个样子了，我也改不了”。我希望能够出一些可度量的指标。这样对于现有的项目，我们可以拿这些指标去度量这些问题有多严重。
当下次别人问你微服务为什么这么拆，而不是那么拆的时候，你可以给出令人信服的理由，而不是“我觉得”。

我不是销售像 Angular 那样可以直接 git clone 一份的代码框架给你。我想分享的是一套可以适用于任何语言和框架的分解业务逻辑的套路。从《Clean Architecture》和《Domain Driven Design》你应该已经学到了很多了。如果仍然不会拆，那么可以再读读《业务逻辑拆分模式》试试。

* [拆分成什么呢?](./Modules.md)
* [Git仓库的组合关系](./Composition.md)
* [评价拆得好坏的角度1：Autonomy](./Autonomy.md)
  * [Autonomy 指标](./AutonomyMetrics.md)
  * [各种需求下都有哪些常规拆法？](./Integration/README.md)
    * [需求模式：离散型UI](./Integration/DiscreteUI/README.md)
    * [需求模式：混合型UI](./Integration/MixedUI/README.md)
    * [需求模式：离散型流程](./Integration/DiscreteProcess/README.md)
    * [需求模式：混合型流程](./Integration/MixedProcess/README.md)
    * [需求模式：产品族](./Integration/ProductFamily/README.md)
    * [需求模式：领先技术](./Integration/Library/README.md)
  * [亚马逊的下单流程](./Integration/AmazonExample/README.md)
  * [如何依赖倒置？意义是什么？](./DependencyInversion.md)
* [评价拆得好坏的角度2：Feedback](./Feedback.md)
  * [Feedback 指标](./FeedbackMetrics.md)
  * [为了让锅能甩得出去，要给运行时添加什么样的隔离措施？](./Isolation/README.md)
    * [控制边界](./Isolation/ControlBoundary.md)
      * [隔离模式：进程边界](./Isolation/ProcessBoundary/README.md)
      * [隔离模式：函数边界](./Isolation/FunctionBoundary/README.md)
      * [隔离模式：插件边界](./Isolation/PluginBoundary/README.md)
    * [控制变更](./Isolation/ControlChange.md)
      * [隔离模式：多进程](./Isolation/MultiProcess/README.md)
      * [隔离模式：多租户](./Isolation/MultiTenancy/README.md)
      * [隔离模式：多变种](./Isolation/MultiVariant/README.md)
  * [Autonomy 优先](./Isolation/AutonomyFirst.md)
* [评价拆得好坏的角度3：Consistency](./Consistency.md)
  * [Consistency 指标](./ConsistencyMetrics.md)
  * [哪些常见场景需要一致性？怎么靠机器而不是靠人盯着？](./Scenario/README.md)
    * [常见场景：用户可见的一致性](./Scenario/UserInterface/README.md)
    * [常见场景：优化 Autonomy](./Scenario/AutonomyOptimization/README.md)
    * [常见场景：优化 Feedback](./Scenario/FeedbackOptimization/README.md)
* [真的一点提前设计都不需要吗？](./Consensus.md)