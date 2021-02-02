# Autonomy 优先

回到微服务应该怎么拆分，多少个进程是合理的。
相比 ProcessBoundary，我认为控制好 FunctionBoundary 和 PluginBoundary 更有利于 Feedback。
相比 MultiProcess，我认为一开始就设计好 MultiTenancy 和 MultiVariant 更有利于 Feedback。
进程之所以好用是因为开源社区提供了很完善的基础设施。所以我们习惯了迁就于已有的技术设施，来切分进程以利用上这些现成的设施。
从而因为进程的切分来影响我们对Git仓库和团队的切分。

如果能够做好 FunctionBoundary，PluginBoundary，MultiTenancy 以及 MultiVariant，怎么分进程根本就不是一个问题。
所有的代码都跑在一个进程内，一样可以把 Feedback 做得很好。
那微服务的拆分，其实就等价于Git仓库的拆分，也就是 Autonomy 章节中讨论的问题，怎么拆团队拆Git仓库的问题。
其主旨原则就一条：拆分之后，接口的定义要稳定，不要天天修改，导致频繁的跨团队强协作。我们也对怎么量化这个原则给出了指标计算的方法。

所以 Autonomy 优先，Feedback 的问题，交给基础架构部门去解决。