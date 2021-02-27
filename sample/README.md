演示 motherboard + 插件 的实现方式

* 服务端使用 typescript + node + http json
* 客户端使用 typescript + web + react

```
yarn install
yarn build && yarn start
```

* merchandise 面向购物者的商城项目
    * motherboard 主板
    * ordinary-product 常规商品插件
    * xszk-promotion 限时折扣插件
    * project 聚合项目，无业务代码，仅定义了插件列表和功能入口
* wms 仓库管理系统，用来演示跨项目集成
    * motherboard 主板
    * ordinary-fulfilment 常规履约
    * project 聚合项目，无业务代码，仅定义了插件列表和功能入口
* entity-archetype 基础设施，业务无关

每个项目 yarn build 会聚合主板和所有的插件，构建出两个可执行的进程

* project/client react 写的客户端，启动在 8080 端口
* project/server node 服务端，启动在 3000 端口

client 默认会去连自己的 server

# TODO

* 演示混合型 UI
* 演示离散型流程
* 演示混合型流程