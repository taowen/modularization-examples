# 持续部署

源代码 => cloud，本地开发与生产环境部署脚本同构

* 监听文件系统，发现源代码改动
* 插件和主板合并
* 静态代码生成
* 模型定义导出
* typescript => javascript
* 推荐数据迁移SQL
* javascript 合并成大bundle
* 基于 cloud 包提供的接口，建表，部署构建结果到云服务，跑升级代码