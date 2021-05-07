---
title: Mybatis
date: 2021-05-05 13:32:50
categories:
- 数据库
tags:
---

## Mybatis简介

Mybatis是一个支持普通 SQL 查询，存储过程和高级映射的基于 Java 的优秀持久层框架。相比于JDBC减少了50%以上的代码量，并且满足高并发和高响应的要求。

#### 工作原理

<img src="../../_media/image/QQ截图20210328151930.png" style="zoom: 67%;" />

## 核心组件

SqlSessionFactoryBuilder、SqlSessionFactory、SqlSession、SQL Mapper

#### SqlSessionFactory

SqlSessionFactory是一个接口，在MyBatis中有两个实现类：SqlSessionManager、DefaultSqlSessionFactory。

前者主要用于多线程环境。

Mybatis提供了构造器SqlSessionFacotryBuilder去生产SqlSessionFactory，主要是通过 Configuration 作为引导，采用的是 Builder 模式 。

每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为中心的，而 SqlSessionFactory 唯一的作用就是生产 MyBatis 的核心接口对象 SqlSession，所以它的责任是唯一的。我们往往会采用单例模式处理它 。

使用XML构建SqlSessionFactory

```xml
<configuration>
    <!-- 数据库环境 -->
    <environments default="development">
        <environment id="development">
            <!-- 使用JDBC的事务管理 -->
            <transactionManager type="JDBC" />
            <dataSource type="POOLED">
                <!-- MySQL数据库驱动 -->
                <property name="driver" value="com.mysql.jdbc.Driver" />
                <!-- 连接数据库的URL -->
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf8" />
                <property name="username" value="root" />
                <property name="password" value="root" />
            </dataSource>
        </environment>
    </environments>
    <!-- 将mapper文件加入到配置文件中 -->
    <mappers>
        <mapper resource="com/mybatis/mapper/UserMapper.xml" />
    </mappers>
</configuration>
```

使用Java代码创建SqlSessionFactory

```java
// 数据库连接池信息
PooledDataSource dataSource = new PooledDataSource();
dataSource.setDriver("com.mysql.jdbc.Driver");
dataSource.setUsername("root");
dataSource.setPassword ("root");
dataSource.setUrl("jdbc:mysql://localhost:3306/mybatis");
dataSource.setDefeultAutoCommit(false);
// 采用 MyBatis 的 JDBC 事务方式
TransactionFactory transactionFactory = new JdbcTransactionFactory();
Environment environment = new Environment ("development", transactionFactory, dataSource);
// 创建 Configuration 对象
Configuration configuration = new Configuration(environment);
// 注册一个 MyBatis 上下文别名
configuration.getTypeAliasRegistry().registerAlias("role", Role.class);
// 加入一个映射器
configuration.addMapper(RoleMapper.class);
//使用 SqlSessionFactoryBuilder 构建 SqlSessionFactory
SqlSessionFactory SqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);
```

#### SqlSession

SqlSession有两个实现类DefaultSqlSssion和SqlSessionManager。SqlSession的作用类似于一个JDBC中的Connection对象，代表着一个链接资源的启用。

```java
SqlSession sqlSession = SqlSessionFactory.openSession();
```

#### SQL Mapper

映射器的主要作用就是将 SQL 查询到的结果映射为一个 POJO，或者将 POJO 的数据插入到数据库中，并定义一些关于缓存等的重要内容。 

用XML实现映射器：

```java
// 首先定义一个映射器接口
public interface RoleMapper {
    public Role getRole(Long id);
}
```

```xml
<!-- 其次编写RoleMapper.xml文件 -->
<mapper namespace="com.mybatis.mapper.RoleMapper">
    <select id="getRole" parameterType="long" resultType="role">
        SELECT id,role_name as roleName,note FROM role WHERE id =#{id}
    </select>
</mapper>
```

注解实现映射器：

```java
public interface RoleMapper2 {
    @Select("select id,role_name as roleName,note from t_role where id=#{id}")
    public Role getRole(Long id);
}
```

执行sql语句的两种方式：

+ SqlSession直接发送

  ```java
  Role role = (Role)sqlSession.select("com.mybatis.mapper.RoleMapper.getRole",1L);
  ```

+ 用Mapper接口发送

  ```java
  RoleMapper roleMapper = sqlSession.getMapper(RoleMapper.class);
  Role role = roleMapper.getRole(1L);
  ```

#### 作用域及生命周期

**SqlSessionFactoryBuilder** ：只能存在于创建 SqlSessionFactory 的方法中， 因此 SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域。

**SqlSessionFactory**：SqlSessionFactory 可以被认为是一个数据库连接池，它的作用是创建 SqlSession 接口对象 。 所以它的生命周期就等同于 MyBatis 的应用周期。 

**SqlSession**：所以它应该存活在一个业务请求中，SqlSession 就相当于一个数据库连接（Connection 对象）。 

**Mapper**：Mapper 是一个接口，它由 SqlSession 所创建， 所以它的生命周期应该小于等于 SqlSession 的生命周期 。

## 配置文件详解

MyBatis 配置项的顺序不能颠倒。如果颠倒了它们的顺序，那么在 MyBatis 启动阶段就会发生异常，导致程序无法运行。 

```xml
<configuration><!-- 配置 -->
    <properties /><!-- 属性 -->
    <settings /><!-- 设置 -->
    <typeAliases /><!-- 类型命名 -->
    <typeHandlers /><!-- 类型处理器 -->
    <objectFactory /><!-- 对象工厂 -->
    <plugins /><!-- 插件 -->
    <environments><!-- 配置环境 -->
        <environment><!-- 环境变量 -->
            <transactionManager /><!-- 事务管理器 -->
            <dataSource /><!-- 数据源 -->
        </environment>
    </environments>
    <databaseIdProvider /><!-- 数据库厂商标识 -->
    <mappers /><!-- 映射器 -->
</configuration>
```

#### properties

```xml
<properties resource="jdbc.properties"/>
```

#### settings

```xml
<settings>
    <setting name="cacheEnabled" value="true"/>
    <setting name="lazyLoadingEnabled" value="true"/>
    <setting name="multipleResultSetsEnabled" value="true"/>
    <setting name="useColumnLabel" value="true"/>
    <setting name="useGeneratedKeys" value="false"/>
    <setting name="autoMappingBehavior" value="PARTIAL"/>
    <setting name="autoMappingUnknownColumnBehavior" value="WARNING"/>
    <setting name="defaultExecutorType" value="SIMPLE"/>
    <setting name="defaultStatementTimeout" value="25"/>
    <setting name="defaultFetchSize" value="100"/>
    <setting name="safeRowBoundsEnabled" value="false"/>
    <setting name="mapUnderscoreToCamelCase" value="false"/>
    <setting name="localCacheScope" value="SESSION"/>
    <setting name="jdbcTypeForNull" value="OTHER"/>
    <setting name="lazyLoadTriggerMethods" value="equals,clone,hashCode,toString"/>
</settings>
```

####  typeAliase

```xml
<typeAliases>
    <typeAliases alias="user" type="com.mybatis.po.User"/>
</typeAliases>
```

或者通过扫描包自动设置别( 会使用 Bean 的首字母小写的非限定类名来作为它的别名 ):

```xml
<typeAliases>
  <package name="com.domain"/>
</typeAliases>
```

#### typeHandler

typeHandler 的作用就是承担 jdbcType 和 javaType 之间的相互转换。 

#### objectFactory

当创建结果集时，MyBatis 会使用一个对象工厂来完成创建这个结果集实例。 

#### environments

主要的作用是配置数据库信息 。

#### mappers

```xml
<mappers>
	<mapper class="com.mapper.UserMapper"/>
</mappers>
```

或者扫描包，将包内的映射器接口全部注册为映射器

```xml
<mappers>
	<package name="com.mapper"/>
</mappers>
```

## Mybatis标签

#### insert

`<insert> `元素用于映射插入语句，MyBatis 执行完一条插入语句后将返回一个整数表示其影响的行数。 

- keyProperty：该属性的作用是将插入或更新操作时的返回值赋给 PO 类的某个属性，通常会设置为主键对应的属性。如果是联合主键，可以将多个值用逗号隔开。

+ useGeneratedKeys：该属性将使 MyBatis 使用 JDBC 的 getGeneratedKeys（）方法获取由数据库内部产生的主键 。