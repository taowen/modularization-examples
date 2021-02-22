# 信息隐藏

通过信息隐藏，我们把代码分为“可以随便写的”和“不可以随便写的”两部分。从而控制代码腐化的蔓延。

## Class 的信息隐藏

我们都知道 Class 有一个叫封装的概念。把 Field 和 Method 分为 Public / Private / Protected 三种。通过只暴露 Public 成员，我们就把 Private 和 Protected 成员给隐藏起来了。

![ClassEncapsulation](./ClassEncapsulation.drawio.svg)

如果有如下的代码

```java
public double Area(object[] shapes) {
    double area = 0;
    foreach (var shape in shapes) {
        if (shape is Rectangle) {
            Rectangle rectangle = (Rectangle) shape;
            area += rectangle.Width * rectangle.Height;
        } else {
            Circle circle = (Circle)shape;
            area += circle.Radius * circle.Radius * Math.PI;
        }
    }
    return area;
}
```

根据“开闭原则”（Open Closed Principle），好的代码应该尽量 Open for extension，Close for modification。也就是说，如果

```java
if (shape is Rectangle) {
    // ...
} else if (shape is Circle) {
    // ...
} else if
    // ...
}
```

这样一直修改这个 if/else 是不好的代码。好的做法是把 Rectangle 的 Width/Height 隐藏起来，把 Circle 的 Radius 也隐藏起来。

```java
public double Area(Shape[] shapes) {
    double area = 0;
    foreach (var shape in shapes) {
        area += shape.Area();
    }
    return area;
}
```

从依赖关系上来看，就是如下图所示

![ClassDependency](./ClassDependency.drawio.svg)

这样我们就把代码分为上下两部分。对于 Rectangle，Circle 以及 AreaCalculator 来说，彼此都不知道对方的存在。
也就是大家都依赖 Shape，但是彼此没有依赖关系。

## Git 仓库的信息隐藏

Class 有封装和依赖关系。Git 仓库也有封装和依赖关系。

![GitDependency](./GitDependency.drawio.svg)

在上图中，B和C是互相隐藏的。B的实现细节对C隐藏了，C的实现细节对B也隐藏了。
我们都使用过 visual studio code，其插件化架构就类似上面的依赖关系。[通过新增插件来实现功能的扩展](../VscodeExample/README.md)。

我们可以把这种做法更一般的描述为“主板+插件”。

![Motherboard](./Motherboard.drawio.svg)

容易写出幺蛾子的代码都是集中在一个（主板）Git仓库里的。
在做 Code Review 的时候，只需要重点观照倒置到底层的集成Git仓库是否合理。
所谓合理，就是能不改就不改。除非不开槽，不开扩展点，需求在插件中无法实现了。

“主板+插件”不仅仅可以写 Visual Studio Code 这样的 IDE，对于各种类型的业务系统都是同样适用的。
只是 VsCode 可能一个插件点上可以有多个插件，而业务系统上一般不会有那么多彼此可替换的插件，更多是一个萝卜一个坑的搞法。
主板部分一定要尽可能的小，要不然就会变成所有的需求都要堆到主板里去实现了。

这种写法和上面的“Class信息隐藏”是不是一回事？从倒置的角度是一回事。但是区别是基于 Class 的依赖倒置缺乏编译器的保障，无法确保插件之间不互相引用。

![Motherboard-2](./Motherboard-2.drawio.svg)

这两个禁止才是关键。

* 禁止主板Git仓库反向依赖插件Git仓库
* 禁止插件Git仓库之间互相依赖

## 如何实践，这玩意真能写业务？

理论上看起来很美好，然而有两个问题

* [主板+插件的技术方案](../DependencyInversion/README.md)
* [对应具体的业务需求，怎么拆分出主板和插件来？](../Integration/README.md)

最后我们来看一个[亚马逊商城的综合案例](../AmazonExample/README.md)。

## 不倒置可不可以？

是不是不依赖倒置就不能写插件呢？比如，这个样子是不是也是一样的

![Orchestration](./Orchestration.drawio.svg)

这样不一样可以把代码都写在插件里吗？在最上层加一个“业务编排”，和所谓的“主板”不是同样的概念吗？
这样的问题是插件与插件之间没有互相的依赖关系怎么能实现业务需求呢？比如在成交了之后分佣，分佣插件怎么知道啥叫成交呢？这种写法的大概率后果是更频繁地需要改动“业务编排”Git仓库，从而使之成为瓶颈。然后又逐步发展成下面这个模式：

![Orchestration-2](./Orchestration-2.drawio.svg)

如果不搞出一个主板，允许彼此插件之间互相调用那会更加混乱。相比上面有一个“业务编排”，下边有一个“主板”。那似乎把“业务编排”去掉更简单一些。

那我们只要一个主板吗？并不是这样的，主板的需求来自于 UI 界面的耦合，以及混合流程的耦合。
如果两个业务需求都有完全独立的界面，流程上可以拆分为事件驱动的，那完全可以写两个主板，彼此独立的发展。
比如说我们有一个主板承载了商城订单的界面和流程，来了一个淘宝商品搬家的需求。
这个淘宝商品搬家有独立的UI，只需要商城开个写入商品的接口就可以完成需求。
类似这样的需求就没有必要写成插件，插到商城主板上，而是独立有一个“商品搬家”的主板。

# 中台？集成！

中国企业喜欢包办一个客户的所有需求，这和国外崇尚专业化的做法是非常不同的。这就导致了中国式的 App 从需求上就包括

* 所有的功能都要挤到同一个App的同一个界面的同一个流程里去实现。特别是要往主业务里挤，这样才能分到流量。
* 业务与业务之间有网状的互联互通需求。比如 Uber 就不会分专车，快车，优享。但是国内的业务就会分得很细，彼此之间又要倒流升舱一键呼叫。

中台的出现，不是为了复用，减少新业务的软件开发成本。软件开发能有多少成本，或者说能省多少成本。
不是因为我们认为需求都差不多，可以归纳出可复用的预制件，然后沉淀到中台去。
中台的本质是为了让上面这样的深度整合的需求因为集中到一个部门能做得更快一些。这种类型的需求也许是有中国特色的。
与传统企业财务集中那样的离线整合不同，这里的集成需求需要是在线，深入参与客户交互体验过程之中的。
如果让主界面被任意一个业务所全部独占，其他业务与其合作就阻力会更大一些。
“收口”到中台可以方便业务之间实现稀缺资源的共享（分配，撕逼），也方便业务之间的互联互通，减少适配成本。

中台的本质是“中间的台”，是因为其位置在中间，把各种业务各种功能整合集成到了一起。
过去某种特定的实现中台的技术方案可能会过时，会消失。
但是只要中国式的 App 风格不变化，对中台的需求是不会消失的。

最大化客户 LTV 在获客成本高企的今天有其合理性。
技术是为业务成功服务的。如果业务需要高复杂度的逻辑整合，那么技术写得出来得写，写不出来也得写。

希望前面提过的几种业务逻辑拆分模式可以让我们对于中台该做什么，不该做什么，有一个不同的视角的认识。
以这个[虚构故事](https://zhuanlan.zhihu.com/p/82586450)自省：

```
中台部门自称自己是 Software Product Line，提供了一堆预制件以及装配用的 DSL，能加速新业务的快速上线与试错。
CTO 希望中台是 Central Platform 削平内部的山头，打通数据和权限的利器。
实际不小心落地成了 Middle Office（Middle 衙门），只要从此过，留下买路财的官僚机构。
```

当我们拆分出了一堆Git仓库之后，
对于某些集成的需求（并不是所有的集成需求都是如此）使用星型的集成比点对点的集成更经济。
这个负责集成的Git仓库需不需要一个专职的团队，是不是一定要是独立的进程，是不是要创建一个名为中台的组织？
与财务，法务，市场，营销，人力资源等职能不同，这些职能是有自己的专职工作内容的，对技能的要求是有专业性的。
有 HRBP，那需要中台 BP 吗？
业务逻辑拆分模式只探讨到Git仓库的拆分，关于Git仓库如何与组织架构对应起来，留给读者自行寻找答案。