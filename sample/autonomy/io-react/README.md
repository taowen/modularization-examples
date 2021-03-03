# 目的

react 并不 reactive。
reactive-widget 其目的是为了让 react 组件能够订阅它读取了的 ActiveRecord，包括浏览器本地内存数据库里的 ActiveRecord（所谓前端 store），以及远程服务后面的 MySQL。
当 ActiveRecord 被修改了之后，对应的 react 组件应该被自动重新渲染。