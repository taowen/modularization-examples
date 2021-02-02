除了进程之外，函数是一个所有编程语言，所有运行时平台都有的概念。
每次函数调用都有一个运行时的 StackFrame 的数据结构来代表这次调用，某种程度上这就造成了函数的边界。

假设我们要在函数这个层面获得Feedback，那么有如下两种糟糕的结果：

* 日志量太大了：无时不刻不在发生函数调用。全部都记录下来，那看也看不过来呀。
* 一个函数的调用记录啥都说明不了：假设你看到了一个错误报告，仅仅报告了最后一个被调用函数是什么，参数是什么，其余的信息都没有。显然这样的Feedback也是不够的。

所以函数边界的关键不在函数，而在“调用”。我们以 React 渲染界面为例，至少有三种类型的“调用”。

# 同步调用栈

所有的编程语言都有 StackTrace 来记录同步的调用链。同步调用链是不需要额外参数来记录的，编程语言甚至CPU都有基础设施来跟踪 caller/callee 的关系。
比如我们调用 React.createElement 的时候，React 内部又会调用几个子函数，执行完了之后以 React.createElement 返回值的形式返回给我们一个 React Element。

# 异步调用栈

React 的界面刷新过程是异步的。当我们调用 this.setState 的时候，我们并不能拿到返回值，也不能肯定在函数调用返回的时刻，界面已经刷新完成了。
这个时候我们只能确定 React 已经把要拿什么新的 state 刷新界面这个事情记录下来了，将来会执行的。
那我们想要知道谁触发了渲染，从哪里调用过来的，怎么办？
这个时候就无法依赖 javascript 内置的同步调用链了，而需要依赖 React 提供的异步调用链。
React 的开发者工具也提供了可视化的界面来展示这个异步调用链。
详情参见 https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16

```js
import {
  unstable_trace as trace,
  unstable_wrap as wrap
} from "scheduler/tracing";

trace("Some event", performance.now(), () => {
  this.setState(newState)
});
```

这样我们调用 `require('scheduler/tracing').unstable_getCurrent` 的时候，就可以从返回的 interactions 里找到 Some event 这个 interaction 了。
似乎这里并没有给 this.stateState 提供额外参数，那么 React 是如何把异步函数调用给串起来的呢？
这里 React 使用了 unstable_trace 设置的全局变量。如果不依赖全局变量，写法应该是

```js
const newContext = context.trace('Some event');
this.setState(newContext, newState);
```

以显式传递一个 context 参数的形式来把调用链给串起来。这种做法也是 Go 等异步编程语言的常见模式。
在非前端的场景下，一般都无法使用全局变量，所以 Java 等语言会用 Thread Local 来代替全局变量，实现 React 类型的模式。

# 组件树

React 的每个组件都是一个函数。

```jsx
function A() {
    return <div><B/><C/></div>
}
function B() {
    return <span>B</span>
}
function C() {
    return <span>C</span>
}
```

从语法层面上来看，这个组件就是一个函数调用栈。组件嵌套了组件，也就是函数嵌套调用了函数。
在 React 内部，要记录 A/B/C 三次调用，以及调用与被调用的 caller/callee 关系。
那为什么我们在 `<B/>` 的调用上，为什么看不到把 A 做为参数传递过去的呢？
这是因为 React 是一个“虚拟机”，`<div><B/><C/></div>` 是这个“虚拟机”支持的“代码”。
在解释执行 `<div><B/><C/></div>` 的过程中，React 自然可以任意把上下文的参数塞进去。

当然，实际执行的时候，React并不是虚拟机，`<div><B/><C/></div>` 也并不是虚拟机的执行代码。
但是 caller/callee 的关系是真的要被记录下来的，在查找问题的时候，其 caller/callee 的关系也是非常有用的。
之所以要把“组件树”假装成函数调用，是想要启发你 StackTrace 其实意味着什么。

当 React 组件的行为异常的时候：

* 仅仅告诉你同步调用栈够吗？不够，因为不知道是谁触发了我重渲染，我的父组件又是谁
* 仅仅告诉你异步调用栈够吗？不够，因为不知道具体是哪个直接的同步函数调用出了问题，也不知道是界面哪个角落的组件出的问题。
* 仅仅告诉你是界面上哪个位置的组件出的问题够吗？不够，因为只知道哪里出了问题，并不能告诉我谁引起的问题

跟踪“调用”是为了调查“因果关系链”。只要是能回答“因果关系”的信息，都是 Feedback 所需要的信息。

# 索引与落盘

无论是编程语言原生支持的同步调用栈，还是需要自研的异步调用栈，组件树，其目的都是隔离。
隔离就是给caller/callee 关系**建索引**，在找问题的时候尤其有用。

另外因为内存成本低很多，先把日志都整理好记录在内存中，如果有必要的时候再持久化下来。
目前的硬件还无法 7*24 的把调用栈落盘，或者说大部分业务的客单价从商业价值上还无法支持这样的成本。
这也是进程隔离的优势，进程间调用是精心设计的，其数据量也小得多。