# Part.2 只对自己写的代码负责

TODO 

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