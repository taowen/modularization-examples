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
    * io 对 I/O 外设的抽象接口
    * io-react 为 react 技术栈对接 I/O 外设
    * demo 演示如何输入输出

每个项目 yarn build 会聚合主板和所有的插件，构建出两个可执行的进程

* project/client react 写的客户端，启动在 8080 端口
* project/server node 服务端，启动在 3000 端口

client 默认会去连自己的 server

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

这三份代码会被 buildModel.ts 聚合之后，输出到

merchandise/project/client/Sell/Ui/ProductDetailsPage.js

* client：是客户端代码，因为 src/Sell/Ui 是在 Ui 下
* merchandise/project/package.json：这里了定义了 merchandise 项目的所有插件，聚合之后的代码也会写出到这个目录下
* ProductDetailsPage.js：typescript 代码的后缀是 .ts 或者 .tsx，实际执行的代码需要转换成 .js 文件

# TODO

* ActiveRecordClass 改名为 Table，订阅的对象改名为 atom 类型 any
* 删掉默认的 isExecuting 实现，改为更 general 的实现
* 定义一个最小的 cloud 依赖接口
* 提供一个本地内存mock的 cloud，包括：lambda, aurora, redshift, s3, cognito
* 提供一个基于 aws 的 cloud
* 用 esbuild 重写 continous delopyment 脚本，检测代码改动，部署到 cloud
* io 中增加 association 提供关联关系的定义和遍历
* 给 service 声明 prefetch
* 拆分 rx-core 和 rx-react
* 基于声明式 UI 实现 mp 和 mp-wx
* 响应式表单 rx-form
* 演示混合型 UI
* 演示离散型流程
* 演示混合型流程
