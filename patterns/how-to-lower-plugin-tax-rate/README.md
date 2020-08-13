# 问题

开槽，开插件，都是为了把代码写得更灵活。但是每一开一个扩展点，就需要写一堆样板代码。如何才能降低“插件税”呢?

# 分析

开一个插件的成本分为两部分

* 把接口以某种方式定义出来
* 把模块装配好

UI 组合，以及发 Event 看起来不像函数调用，但其实只是受限的函数调用

* render(props)，UI 组件的特点是返回值是固定的，就是一个视觉区块。
* publish(event)，Event 就是一个没有返回值的函数调用

所以可以认为把代码写活，其实就等价于抽取一个函数出来，在某个时刻装配模块，选择这个函数的实现。

## 降低抽取接口的成本

用过 Intellij 写 Java 的同学可能用过 Extract Method 的重构快捷方式。最简单的抽一个扩展点的方式，就是用 Extract Method 重构菜单，把一段语句抽取到一个独立的函数里。这个函数签名，就是接口定义。这个是最最底线的成本。

在这个之上，很多模块化方案可能会要求新增一个 interface 文件，或者在web页面操作一下，注册一个接口。或者加一些 manifest 文件。这些额外的操作都是插件税。

## 降低模块装配成本

模块的打包和部署可以有非常多的选择。

* 在源代码层面进行文本操作
* .a 文件，静态链接
* .so 文件，动态链接
* 面向对象的多态 / 函数式编程的高阶函数

linker 是所有程序员都熟悉的概念，无论是 .a 还是 .so。我们可以在源代码的文本层面实现一个和 linker 一样的“函数链接器”。比如有一个 a.js 文件，定义了

```js
function hello() {
    world();
}

function world() {
    // placeholder
}
```

我们有另外一个 b.js 文件，定义了

```js
@override
function world() {
    console.log('world');
}
```

通过某种类似 linker 的文本构建工具，把 a.js + b.js 输出成 c.js。因为 world 函数同名且标记了 `@override`，所以 b.js 中的定义就覆盖了 a.js：

```js
function hello() {
    world();
}

// override by b.js
function world() {
    console.log('world');
}
```

装配后的结果可以直接被阅读，比运行时装配要更直观。
这里 js 文件只是例子。文本操作可以普适于任何有文本源代码的编程语言。
比如 angular 的 template 文件，也可以用类似的技术来实现模块的静态组装。
这种模块装配的实现技术在所有打包部署的选项里是各项代价都是最低的。

## 静态装配

在“[可逆计算的技术实现](https://zhuanlan.zhihu.com/p/163852896)”作者提出的面向 AST 的源代码 transformer 也是类似的。只是要处理 Tree 的话，会比 Flat List 要复杂一些，需要定位到 Tree 的节点，然后再应用 Transform 操作。

比“可逆计算”更出名的是 Hyper/J 和 AspectJ。它定义了 PointCut / Advice / JoinPoint 等概念。最初版的 AspectJ 是由 Source-code Weaver 实现的。其实就是把两个文本文件，粘合成一个文本文件。但是大部分 Java 项目都不想增加一个“静态代码生成”的步骤，所以实际上 AspectJ 的 Class load time Weaver 更常用，但是也就使得其定位和 Spring 的 IoC 是大部分重叠的。

从 AspectJ 的历史可以看出，大部分语言的工具链生态里是不赞成“代码生成”的。这个也导致了如果要采用静态装配缺少工具链的支持。
如果工具支持跟不上，静态装配带来的好处不仅仅无法显现，而且会有诸多的坏处。
任何模块化方案，都需要一个模块化的底座平台，以及生产力工具。插件税的高与低，就与我们投入多少时间和成本建设这个底座平台有关系。

