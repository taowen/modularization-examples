# 目的

react 并不 reactive。

io-react 其目的是为了让 react 组件能够订阅它读取了的 ActiveRecord，包括浏览器本地内存数据库里的 ActiveRecord（所谓前端 store），以及远程服务后面的 Active（可能是存在 MySQL 里的，也可能是其他数据库）。当 ActiveRecord 被修改了之后，对应的 react 组件应该被自动重新渲染。

给 Widget 提供了如下的能力

* this.subscribe 用 scene 进行异步 I/O 并订阅。subscribe 返回非 Promise 的普通数据，可以直接被 react 渲染使用
* this.callback 给回调提供 scene 参数，从而能执行异步 I/O，并根据 I/O 改动的 ActiveRecord，自动触发页面刷新
* this.executing 判断指定的 callback 是不是还在执行中，用来实现按钮置灰，防止重复点击的需求
* 组件 mount 时的数据加载可以由 Suspense 捕捉，错误由 ErrorBoundary 捕捉。这可以用来实现第一次打开时的转圈圈
* 由 callback 触发的页面刷新，其数据加载不会触发 Suspense（避免界面闪烁），数据加载遇到的异常由 Widget.onUnhanledCallbackError 捕捉

## To React Expert

其行为类似于 https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html 中描述的 Render-as-you-fetch，也就是在 render 方法中 throw promise 的数据获取方法。同时默认给每个 callback 加了 useTransition 的效果。

但是该行为并不依赖于开启 React Concurrent 模式渲染，而且不兼容于 React Concurrent 模式。这同时也是优点，这意味着我们可以用 Preact 这样的精简版本来代替 React，甚至移植到 Vue 上。