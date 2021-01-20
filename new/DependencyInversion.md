最理想的拆分后又组合的方式是“粘贴”到一起。就像你把一块砖，劈开了。拼装回去就是把两半又放一起。也就是我们可以有一个通用的函数 integrate(comp1, comp2, .. compN)。很多组件化系统都是这么吹捧自己的，比如说父类与子类，最终拼装出结果，这个拼装就是继承规则。比如说 OSGi，一堆 bundle，不用管他们是什么，都可以用同样的方式拼装起来。然而，我们都知道业务逻辑拆分出 git 仓库之后，往往是没有办法用通用的函数组合回去的。

比如说我们需要描述两个模块提供的按钮，哪个在哪个的左边。比如说我们要拼装两条促销规则，要说明哪个用了之后哪个就不能用了。这些业务上的空间组合，时间组合是必不可少的。

任何向你推销通用的组合式组件系统的人，最终都会搞出一个配置文件给你写“装配逻辑”。这样的模块装配文件就是没事找事，本来可以用大家都懂的 javascript 解决的问题，要变成用 XML 换了花来写。

我们如果拆出了 B 和 C 这两个 Git 仓库。理论上只有两种把 B 和 C 集成起来的办法：

# 编排

引入一个 A 仓库，它依赖了 B 和 C。

![orchestration](./DependencyInversion-1.drawio.svg)

# 依赖倒置

引入一个 A 仓库，提供接口。由 B 和 C 实现这个接口，插入到 A 上。就像主板和显卡那样，A 就是主板，B 和 C 就是显卡。

![motherboard](./DependencyInversion-2.drawio.svg)

在 B 和 C 上面还需要一个仓库 D 把大家都包括进去，但是这个仓库里可以没有业务逻辑了。
与编排的区别在于，编排的方式里，A 是可以依赖任意 B 和 C 的实现细节的，没有必要声明哪些是接口，哪些是实现。
在依赖倒置的模式下，如果 A 没有声明接口让 B 和 C 实现，B 和 C 就没有办法通过 A 把它们俩集成到一起去。

# 依赖倒置的实现办法

要实现依赖倒置有运行时和编译时两种做法

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