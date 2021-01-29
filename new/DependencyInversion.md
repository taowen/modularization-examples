最理想的拆分后又组合的方式是“粘贴”到一起。就像你把一块砖，劈开了。拼装回去就是把两半又放一起。也就是我们可以有一个通用的函数 integrate(comp1, comp2, .. compN)。很多组件化系统都是这么吹捧自己的，比如说父类与子类，最终拼装出结果，这个拼装就是继承规则。比如说 OSGi，一堆 bundle，不用管他们是什么，都可以用同样的方式拼装起来。然而，我们都知道业务逻辑拆分出 git 仓库之后，往往是没有办法用通用的函数组合回去的。

比如说我们需要描述两个模块提供的按钮，哪个在哪个的左边。比如说我们要拼装两条促销规则，要说明哪个用了之后哪个就不能用了。这些业务上的空间组合，时间组合是必不可少的。

任何向你推销通用的组合式组件系统的人，最终都会搞出一个配置文件给你写“装配逻辑”。这样的模块装配文件就是没事找事，本来可以用大家都懂的 javascript 解决的问题，要变成用 XML 换了花来写。

# 文件做“集成”

业务逻辑会拆分成

* 文件
* 文件夹
* Git 仓库

Git 仓库负责了拆分。文件的作用就是“集成”。比如最最常用的方式

```ts
function functionA() {
    funcitonB();
    functionC();
}
```

我们把 functionA 放在 A 中，functionB 和 functionC 放在 B/C 中。这就是最常用的“编排”集成方式。通过把它们放在一个文件中，我们声明了 functionB 要发生在 functionC 之前，说明了时间上的顺序规则。

如果我们用的是 React 写界面，可以声明

```ts
function functionA() {
    return <ul><li><functionB/></li><li><functionC/></li></ul>
}
```

这个就说明了在界面上，functionB 要放在 functionC 的上一行。通过一个文件，说明了空间上的顺序规则。
这也说明了文件的主要意义，它是用来把逻辑**在时间和空间上做集成**的。
说明在空间上，多个Git仓库是如何组合的，哪个在左哪个在右。
说明在时间上，多个Git仓库是互相交互的，哪个在前哪个在后。

如果两行代码，写在同一个文件，和写两个文件里，没有啥区别。
那说明这两行代码没有必要强行塞到同一个文件里。比如你写了一个 User.ts，有用户可以发招租的界面样式代码，也有用户买外卖的处理过程代码。
这些没有强烈时空上集成规则的两个东西都强行塞到 User.ts 里，实际上就没有利用好“文件”的特殊性质，是对稀缺注意力资源的浪费。

我们如果拆出了 B 和 C 这两个 Git 仓库。理论上只有两种把 B 和 C 集成起来的办法。

# 顶层编排

引入一个 A 仓库，它依赖了 B 和 C。

![orchestration](./DependencyInversion-1.drawio.svg)

集成"文件"定义在依赖的最顶层里。

# 依赖倒置

引入一个 A 仓库，提供接口。由 B 和 C 实现这个接口，插入到 A 上。就像主板和显卡那样，A 就是主板，B 和 C 就是显卡。

![motherboard](./DependencyInversion-2.drawio.svg)

在 B 和 C 上面还需要一个仓库 D 把大家都包括进去，但是这个仓库里可以没有业务逻辑了。
集成"文件"定义在依赖的最底层。

与顶层编排的区别在于，编排的方式里，A 是可以依赖任意 B 和 C 的实现细节的，没有必要声明哪些是接口，哪些是实现。
在依赖倒置的模式下，如果 A 没有声明接口让 B 和 C 实现，B 和 C 就没有办法通过 A 把它们俩集成到一起去。

依赖倒置在传统的思维里是为了让代码更“可复用”。如果明显是一次性的业务，是不是一定不需要依赖倒置。
或者说依赖倒置了，一定是追求复用呢？
我觉得，依赖倒置主要的目的是让做集成的Git仓库依赖最少。依赖越多，能力就强大，就越难抵制被“往里面加代码的诱惑”。
顶层编排的做法里，编排处于依赖关系的最顶层，能力最强大，从而也最容易变成大杂烩。

在拆分 Git 仓库的前提下，集成代码变动越频繁，需要付出的沟通成本就越大。
Autonomy 的核心关键就是负责集成Git仓库的接口尽量稳定，少修改。
一方面是选择更模糊信息量少的接口，例如能用UI集成的，就不要用数据集成。
另外一方面就是最小化接口部分的代码量，能用两个参数搞定的，就不要用三个参数。
依赖倒置是一种“抑制剂”，它使得集成代码的修改更困难，更不方便，从而去迫使开发者会更慎重地去设计接口。

# 如何实现依赖倒置？

要实现依赖倒置有运行时和编译时两大类做法，无数种具体实现。这里列举几种代表性的。

## 运行时：组合函数

以 TypeScript 示例。

我们可以在 A 中写这样的一个接口

```ts
function functionA(b: () => void, c: () => void) {
    b();
    c();
}
```

然后在 B 和 C 中写两个函数

```ts
function functionB() {
    console.log('b');
}
```

```ts
function functionC() {
    console.log('c');
}
```

然后在 D 中组装，添加 A，B，C 三个 Git 仓库做为依赖，并调用 functionA：

```ts
const functionA = require('A');
const functionB = require('B');
const functionC = require('C');

function functionD() {
    functionA(functionB, functionC);
}
```

## 运行时：组合对象

以 TypeScript 示例。

我们可以在 A 中写这样的一个接口

```ts
function functionA(b: { doSomething(): void; }, c: { doSomething(): void; }) {
    b.doSomething();
    c.doSomething();
}
```

然后在 B 和 C 中写两个对象

```ts
const b = {
    doSomething: function() {
        console.log('b');
    }
}
```

```ts
const c = {
    doSomething: function() {
        console.log('c');
    }
}
```

然后在 D 中组装，添加 A，B，C 三个 Git 仓库做为依赖，并调用 functionA：

```ts
const functionA = require('A');
const b = require('B');
const c = require('C');

function functionD() {
    functionA(b, c);
}
```

## 编译时：模板

以 C++ 为例。

我们可以在 A 中写这样的一个接口

```c++
template<typename TB, typename TC>
void functionA() {
    TB::doSomething();
    TC::doSomething();
}
```

然后在 B 和 C 中写两个类

```c++
#include <iostream>

class ClassB {
public:
    static void doSomething() {
        std::cout << 'b' << std::endl;
    }
};
```

```c++
#include <iostream>

class ClassC {
public:
    static void doSomething() {
        std::cout << 'c' << std::endl;
    }
};
```

然后在 D 中组装，添加 A，B，C 三个 Git 仓库做为依赖，并调用 functionA：

```ts
#include "A.hpp"
#include "B.hpp"
#include "C.hpp"

void functionD() {
    functionA<ClassB, ClassC>();
}
```

## 编译时：函数替换

以 TypeScript 为例

我们可以在 A 中写这样的一个接口

```ts
class A {
    public a() {
        this.b();
        this.c();
    }
    public b() {
        throw new Error('not implemented');
    }
    public c() {
        throw new Error('not implemented');
    }
}
```

然后在 B 和 C 的 Git 仓库中“覆盖” ClassA 的实现

```ts
// 在同样的文件夹和文件名中定义
class A {
    @override
    public b() {
        console.log('b');
    }
}
```

```ts
// 在同样的文件夹和文件名中定义
class A {
    @override
    public c() {
        console.log('c');
    }
}
```

然后在 D 中组装，添加 A，B，C 三个 Git 仓库做为依赖:

```json
{
    "name": "@someOrg/D",
    "version": "0.0.1",
    "dependencies": {
        "@someOrg/A": "0.0.1",
        "@someOrg/B": "0.0.1",
        "@someOrg/C": "0.0.1"
    }
}
```

然后需要用编译工具，在编译 D 的时候，因为 B/C 中的 ClassA 与 A中的 ClassA 同文件夹且同文件名，替换 ClassA 中的函数。
这样就达到了和 C++ 模板类似的效果。

## 运行时：Vue 插槽

Vue 的插槽和 TypeScript 函数组合是类似的。

我们可以在 A 中写这样的一个接口

```html
<!-- A.vue -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

然后在 B 和 C 中写两个组件

```html
<!-- B.vue -->
<div>b</div>
```

```html
<!-- C.vue -->
<div>c</div>
```

然后在 D 中组装，添加 A，B，C 三个 Git 仓库做为依赖，调用 A 组件:

```html
<A>
    <template #header>
        <B/>
    </template>
    <template #header>
        <C/>
    </template>
</A>
```

## 编译时：页面模板替换

和函数替换一样，也可以对页面模板做替换。

我们可以在 A 中写这样的一个接口

```html
<!-- A.tm -->
<template #default>
    <div class="container">
    <header>
        <B/>
    </header>
    <footer>
        <C/>
    </footer>
    </div>
</template>
<template #B>
</template>
<template #C>
</template>
```

然后在 B 和 C 中覆盖 A.tm 页面模板中的子模板

```html
<!-- 在同样的文件夹和文件名中定义 -->
<override #B>
    <div>b</div>
</override>
```

```html
<!-- 在同样的文件夹和文件名中定义 -->
<override #C>
    <div>c</div>
</override>
```

然后在 D 中组装，添加 A，B，C 三个 Git 仓库做为依赖:

```json
{
    "name": "@someOrg/D",
    "version": "0.0.1",
    "dependencies": {
        "@someOrg/A": "0.0.1",
        "@someOrg/B": "0.0.1",
        "@someOrg/C": "0.0.1"
    }
}
```

然后需要用编译工具，在编译 D 的时候，因为 B/C 中的 A.tm 与 A中的 A.tm 同文件夹且同文件名，替换 A.tm 中的子模板。
这样就达到了和 C++ 模板类似的效果。

# 显式组合与隐式组合

显式组合需要在代码中定义新的函数或者类，由新定义的函数或者类来组装原有的东西。例如

```ts
const functionA = require('A');
const functionB = require('B');
const functionC = require('C');

function functionD() {
    functionA(functionB, functionC);
}
```

优点是组装非常灵活，可以表达任意复杂的逻辑。缺点是组装非常灵活，导致实际运行时的装配关系很难阅读代码得知。

隐式组合是指：

```json
{
    "name": "@someOrg/D",
    "version": "0.0.1",
    "dependencies": {
        "@someOrg/A": "0.0.1",
        "@someOrg/B": "0.0.1",
        "@someOrg/C": "0.0.1"
    }
}
```

仅仅声明 Git 仓库之间的依赖关系。由编译工具，根据同文件夹，同文件名做函数和模板替换。这样的隐式组合缺点是依赖特殊编译工具链，好处是搞不出花样，仅仅实现了依赖倒置的目的，而不具有二次动态装配的能力（以及随之而来的理解成本）。

使用隐式组合的方式来做依赖倒置，顶层的Git仓库里就没代码了，可以保证除了依赖最底层被倒置的那个模块，其他地方都写不了集成代码。
这样就用编译器保证了，容易写出幺蛾子的代码都是集中在一个Git仓库里的。
在做 Code Review 的时候，只需要重点观照倒置到底层的集成Git仓库是否合理。
所谓合理，就是能不改，就不改。除非不开槽，不开扩展点，需求没地方写了。