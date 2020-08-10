# 如何复用一套代码支持多样性的业务？

有太多的文章教你怎么写代码了。但是这些文章大都是系统A，模块B的抽象写意派。本文的目的是通过十余个具体业务的例子来说明，如何组织代码才能实现复用，并且支持多样性的业务。
全文分为四个章节：

* 模块切分的好坏标准是什么？
* 这些经典的解决方案用了也就那样
* 松耦合的接口应该定义成什么样子？
* 为什么实际的业务代码都没有写成你说的那个样子？

# 模块切分的好坏标准是什么？

复用，以及支持多样性，都是同一个问题的不同表述。其实质问题是如何对系统进行模块分解。需要分成几个模块，模块之间的依赖关系是怎样的？下面通过四个具体的例子来说明。

## 公共模块应该稳定

[【阅读该例子】](./common-module-should-be-stable)

在 [Agile Software Development](https://www.amazon.com/Software-Development-Principles-Patterns-Practices/dp/1292025948) 书中，Robert Martin 讲过了很重要的两个原则

* 越是被很多模块依赖的模块，越应该减少改动。道理很简单，底层模块一改，上层的模块必然受到影响。依赖关系的方向，就是“不稳定”依赖“稳定”的方向。
* Common Reuse Principle。要复用的模块不要把过多的东西捆绑，要复用就整体复用。

## 超级繁忙的顶层模块

[【阅读该例子】](./crazy-busy-top-module)

模块与模块之间的依赖关系，就是抽象与稳定的关系。但实践中，像“业务编排API”和“BFF”，你很难判断谁比谁更稳定，更抽象。当我们一个业务请求，需要经过一串模块的时候，往往是有问题的。因为当要做修改的时候，你会觉得在哪个环节拦一刀都有道理。David Parnas 在 [The Secret History of Information Hiding](https://www.researchgate.net/profile/David_Parnas/publication/200085877_On_the_Criteria_To_Be_Used_in_Decomposing_Systems_into_Modules/links/55956a7408ae99aa62c72622/On-the-Criteria-To-Be-Used-in-Decomposing-Systems-into-Modules.pdf?origin=publication_detail) 一文中也写道，他认为 Levels of Abstraction 是很难判断的。

这个例子应该怎样调整是合适的?分法有很多，可以按流程步骤分，可以按业务变化频率分，但从依赖关系的结构上来说，一定是这样的结构

* 一定是**多个模块**直接面向**多个业务方向**，每个模块承担一些，而不是集中把修改工作都压到一个顶层模块上
* 在这多个模块上面一定不能拿一个“业务收口”模块载往顶上套一层。所谓业务编排，其实就是业务编程。只要可以编程，就会抑制不住地往里面加东西。

不会因为把函数调用，改叫“业务编排”，就改变模块之间的依赖关系。依赖关系才是真正决定性因素。