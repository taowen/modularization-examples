阅读下面这段代码

```java
public class ReserveNumberService {
 
    private final static Logger LOGGER = LoggerFactory.getLogger(SelectNumberService.class);
 
    @Inject
    SqlMapClient sqlMapClient;
 
    public void reserverNumber(String userId, String number) {
        try {
            String oldNumber = (String) sqlMapClient.queryForObject("reservedNumber", userId);
            releaseOldAndReserveNew(userId, oldNumber, number);
        } catch (SQLException e) {
            LOGGER.error("failed to reserve number " + number + “ for user “ + userId, e);
        }
    }
 
    private void releaseOldAndReserveNew(String userId, String oldNumber, String newNumber) throws SQLException {
        sqlMapClient.startTransaction();
        try {
            if (oldNumber != null) {
                sqlMapClient.update("releaseNumber", oldNumber);
            }
            HashMap params = new HashMap();
            params.put("number", newNumber);
            params.put("usreId", userId);
            if (sqlMapClient.update("reserveNumber", params) == 0) {
                throw new RuntimeException(newNumber + " already reserved by someone else");
            }
            sqlMapClient.commitTransaction();
        } finally {
            sqlMapClient.endTransaction();
        }
    }
}
```

你的第一印象是什么？我的印象是满屏的sqlMapClient。你能第一眼就说出这段代码中出现了哪些概念，又解决了什么问题吗？或许不是那么容易的事情。如果用DDD的方式来写，也许是这样：

```java
 public class PhoneNumber {
 
    private final String number;
    private User reservedBy;
 
    public PhoneNumber(String number) {
        this.number = number;
    }
 
    public void reservedBy (User user) {
        reservedBy = user;
    }
 
    public void release() {
        reservedBy = null;
    }
}
public class User {

    private PhoneNumber reservedNumber;
 
    public void reserve(PhoneNumber number) {
        if (reservedNumber != null) {
            reservedNumber.release();
        }
        number.reservedBy(this);
        this.reservedNumber = number;
    }
}
```

通过阅读上面的代码，我们会发现其中牵涉到了两个领域概念，分别是User和PhoneNumber。要建模的问题其实是User如何Reserve一个PhoneNumber。业务逻辑是PhoneNumber只能被一个User预定，而且一个User只能预定一个PhoneNumber，如果要预定新的必须先释放旧的。

也许上面的那段业务分析可能就出现在selectNumber这个方法的注释里，也可能是在某某详细设计文档里。但是为什么不能让代码自身反映出这些业务上的概念呢？在我看来，让代码成为永不过期的文档就是DDD整套理论的出发点。

使用DDD，当我们写代码的时候，就可以关注在PhoneNumber和User的逻辑关系上。当我们和其他开发人员交流的时候，就可以讲PhoneNumber如何如何，User如何如何，而不用说某某表的某某字段是什么值。当我们和业务人员交流的时候，至少我们不用在对话里提到sqlMapClient如何如何。