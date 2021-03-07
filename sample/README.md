演示 motherboard + 插件 的实现方式

```
安装 node：https://nodejs.dev/
安装 yarn：https://classic.yarnpkg.com/en/
yarn install
yarn build && yarn start
```

# 各 Git 仓库

因为是例子，所以下面是用目录模拟的，实际开发中会使用独立 Git 仓库来保存主板和插件的代码

* merchandise 面向购物者的商城项目
    * motherboard 主板
    * ordinary-product 常规商品插件
    * xszk-promotion 限时折扣插件
    * project 聚合项目，无业务代码，仅定义了插件列表和功能入口
* wms 仓库管理系统，用来演示跨项目集成
    * motherboard 主板
    * ordinary-fulfilment 常规履约
    * project 聚合项目，无业务代码，仅定义了插件列表和功能入口
* stableinf 基础设施，业务无关

# 目录结构

* src/** 代码都在 src 下
* src/**/Public/ 服务端代码，例如 src/Sell/Public/ProductGateway.ts
* src/**/Ui/ 客户端代码，例如 src/Sell/Ui/ProductDetailsPage.tsx
* package.json Git 仓库之间的依赖关系
* tsconfig.json 提供 @motherboard 这个 import 时的别名

多个 Git 仓库之间通过相对路径来聚合代码，例如

* motherboard 中定义了 src/Sell/Ui/ProductDetailsPage.tsx
* ordinary-product 中定义了 src/Sell/Ui/ProductDetailsPage.impl.tsx
* xszk-promotion 中定义了 src/Sell/Ui/ProductDetailsPage.impl.tsx

这三份代码会被 @stableinf/deploy 聚合为

Sell/Ui/ProductDetailsPage.js

# TODO

* 修复 demo：多点几次“重算一次”会没反应
* 尝试 Reactive 基类，特别是嵌套 Form
* 把 BrowserLocation 改为基于 Reactive 实现的
* Scene 和 promise 一一对应，跟踪 scene 的生命周期
* 提供一个基于 aws 的 cloud
* io 中增加 association 提供关联关系的定义和遍历，attachTo scene
* 给 service 声明 prefetch
* 拆分 rx-core 和 rx-react
* 基于声明式 UI 实现 mp 和 mp-wx
* sqlView({ criteria, model, data }) 独立一个文件定义
* archived 标志位，delete 归档，独立归档数仓表
* OLTP => 实时数仓 => 离线数仓
* 演示混合型 UI
* 演示离散型流程
* 演示混合型流程
