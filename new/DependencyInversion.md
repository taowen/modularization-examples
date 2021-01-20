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

## 运行时：函数指针

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

## 运行时：面向对象

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
