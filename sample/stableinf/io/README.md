# 提供三种 I/O 外设的标准接口

* RPC 调用：ServiceProtocol.callService
* 关系型数据库单表：Database.insert/Database.query/ActiveRecord.update/ActiveRecord.delete
* 关系型数据库多表：Database.executeSql

# 提供分布式 Trace 和 I/O 订阅

* Trace：由 TraceId/TraceOp/Baggage 三部分构成，对应 zipkin 等分布式追踪的模型。一个 Trace 由多个 Operation 组成
* Operation：Trace 在一个进程内执行的部分。一个 Operation 由多个 Scene 组成
* Scene：一次 async 的异步调用链。由 Scene 跟踪了对 ActiveRecord 的读写
* ActiveRecord：代表一张数据库表，是被订阅的概念