---
title: Spring
date: 2021-05-05 13:32:50
categories:
- Spring
tags:
---

## Spring 简介

Spring是一个轻量级的Java Web开发框架，以`IoC`（Inverse of Control，控制反转）和`AOP`（Aspect Oriented Programming，面向切面编程为内核）为内核。该框架采用分层架构，根据不同的功能被划分成了多个模块，如 Core、Bean、Context、AOP 和 Web 等。 

![spring_structure](../../_media/image/1616070771871.png ':size=60%')

## Spring IoC

IoC（控制反转）是指在程序开发中，实例的创建不再由调用者管理，而是由 Spring 容器创建。Spring 提供了两种 IoC 容器，分别为 `BeanFactory` 和 `ApplicationContext`。

#### BeanFactory

`BeanFactory`是一个管理`Bean`的工厂，它主要负责初始化各种`Bean`，并调用它们的生命周期方法。

`BeanFactory`是最基础的`IoC`容器，它由`org.springframework.beans.factory.BeanFactory`接口定义。该接口有很多的实现类，其中最常见的是`org.springframework.beans.factory.xml.XmlBeanFactory`。

```java
BeanFactory beanFactory = new XmlBeanFactory(new FileSystemResource("D://applicationContext.xml"));
```

#### ApplicationContext

`ApplicationContext`是`BeanFactory`的子接口，也被称为应用上下文。

`ApplicationContext`由`org.springframework.context.ApplicationContext`接口定义，该接口有两个常用的实现类：

**1）ClassPathXmlApplicationContext**

该类从`ClassPath`中寻找指定的`XML`配置文件，找到并装载完成`ApplicationContext`的实例化工作。

```java
ApplicationContext applicationContext = new ClassPathXmlApplicationContext(String congfigLocation);
```

**2）FileSystemXmlApplicationContext**

该类从指定的文件系统路径中寻找指定的XML配置文件，找到并装载完成ApplicationContext的实例化工作。

```java
ApplicationContext applicationContext = new FileSystemXmlApplication(String congfigLocation)
```

注意：两者的区别在于`ApplicationContext`在初始化的时候，就会把所有的`Bean`实例化，而`BeanFactory`是在调用`getBean()`的时候才进行`Bean`的实例化。因此，`BeanFactory`占用的系统资源较少。

#### Spring Bean的实例化

实例化Bean有三种方式：构造器实例化、静态工厂方式实例化和实例化工厂方式。

getBean源码分析：

```java
// getBean有多个重载方法，内部实际上是调用doGetBean来获取bean实例
public Object getBean(String name) throws BeansException {
    return this.doGetBean(name, (Class)null, (Object[])null, false);
}
```

doGetBean源码分析：

```java
protected <T> T doGetBean(String name, @Nullable Class<T> requiredType, @Nullable Object[] args, boolean typeCheckOnly) throws BeansException {
    // 通过name获取beanName
    String beanName = this.transformedBeanName(name);
    // 从缓存中获取单例bean
    Object sharedInstance = this.getSingleton(beanName);
	
    if (sharedInstance != null && args == null) {
        // BeanFactory采用懒加载，所以会根据args取匹配合适的构造方法构造bean实例
        bean = this.getObjectForBeanInstance(sharedInstance, name, beanName, (RootBeanDefinition)null);
    } else { 
        // sharedInstance为空，到父容器中查找bean
        BeanFactory parentBeanFactory = this.getParentBeanFactory();
        if (parentBeanFactory != null && !this.containsBeanDefinition(beanName)) {
            return parentBeanFactory.getBean(nameToLookup);
        }

        try {
            // Spring支持配置继承，所以需要合并父子BeanDefinition
            RootBeanDefinition mbd = this.getMergedLocalBeanDefinition(beanName);
            // 创建依赖对象，并处理循环依赖
            if (dependsOn != null) {}
			// 创建bean实例
            if (mbd.isSingleton()) {
                sharedInstance = this.getSingleton(beanName, () -> {
                    try {
                        // 创建bean并放入缓存
                        return this.createBean(beanName, mbd, args);
                    } catch (BeansException var5) {}
                });
                bean = this.getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
            } else if (mbd.isPrototype()) {
                ...
            } else {
                ...
            }
        } catch (BeansException var26) {}
    }
	// 类型转换
    if (requiredType != null && !requiredType.isInstance(bean)) {
        ...
    } else {
        return bean;
    }
}
```



#### Spring Bean的作用域

```java
<bean id="" class="" scope="作用域">
```

`Spring`容器在初始化一个`Bean`的实例时，同时会指定该实例的作用域。

| 作用域           | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| `singleton`      | 单例模式，使用 `singleton` 定义的 `Bean` 在` Spring` 容器中只有一个实例，这也是 `Bean` 默认的作用域。 |
| `prototype`      | 原型模式，每次通过` Spring` 容器获取 `prototype` 定义的 `Bean` 时，容器都将创建一个新的 `Bean` 实例。 |
| `request`        | 在一次` HTTP `请求中，容器会返回该` Bean` 的同一个实例。而对不同的 `HTTP` 请求，会返回不同的实例，该作用域仅在当前` HTTP Request` 内有效。 |
| `session`        | 在一次 `HTTP Session` 中，容器会返回该 `Bean` 的同一个实例。而对不同的 `HTTP` 请求，会返回不同的实例，该作用域仅在当前 `HTTP Session` 内有效。 |
| `global-session` | 在一个全局的` HTTP Session` 中，容器会返回该 Bean 的同一个实例。该作用域仅在使用 `portlet context` 时有效。 |

其中最常用的是`singleton`和`prototype`。

**singleton**

通常情况下，这中单例模式对于无会话状态的`Bean`（如`Service`层、`Dao`层）来说是最理想的。

**prototype**

对需要保持会话状态的`Bean`应该使用 prototype 作用域。 

#### Spring Bean的生命周期

`Bean`的生命周期可以理解为：`Bean`的定义 ->`Bean`的初始化 ->`Bean`的使用 -> `Bean`的销毁。

对于作用范围为`singleton`的`Bean`，`Spring`会将该`Bean`放入SpringIoC的缓存池中，将触发Spring对该Bean的生命周期管理。如果作用范围为`prototype`，则将该Bean交给调用者，调用者管理该Bean的生命周期。

为了定义安装和拆卸一个 `Bean`，我们只要声明带有 `init-method` 或`destroy-method`参数的 。`init-method `属性指定一个方法，在实例化 `Bean` 时，立即调用该方法。同样，`destroy-method` 指定一个方法，只有从容器中移除 `Bean` 之后，才能调用该方法。 

```xml
<bean id="" class="" init-method="" destory-method=""> </bean>
```

## Spring DI（依赖注入）

依赖注入（`Dependency Injection`，`DI`）和控制反转含义相同，他们是从两个角度描述同一个概念。依赖注入主要有两实现方式，分别是属性`setter`注入和构造方法注入。

#### 属性setter注入

通过调用无参构造器或无参`static`工厂方法实例化Bean后，调用该`Bean`的`Setter`方法。

```xml
<bean id="" class="">
	<property name="" value=""/>
    <property name="" ref=""/>
</bean>
```

#### 构造方法注入

通过调用带参数的构造方法实现，每个参数代表一个依赖。

```xml
<bean>
	<constructor-arg index="" value=""/>
    <constructor-arg index="" ref=""/>
</bean>
```

##  Spring Annotation (注解)

要使用`Spring`注解需要使用`context`命名空间，通知`Spring`扫描指定目录，进行注解的解析。

```xml
<context:component-scan base-package="要扫描的目录"/>
```

最基本的注解有以下七种：

| 注解          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `@Component`  | 可以使用此注解描述`Spring`中的`Bean`，但它是一个泛化的概念，仅仅表示一个组件，并且可以作用在任何层次。 |
| `@Repository` | 用于将数据访问层（`DAO`层）的类标识为 `Spring`中的`Bean`。   |
| `@Service`    | 用于将业务层（`Service` 层）的类标识为 `Spring`中的`Bean`。  |
| `@Controller` | 用于将控制层的类标识为 `Spring` 中的 `Bean`                  |
| `@Autowired`  | 用于对`Bean`的属性变量、属性的`Set`方法及构造函数进行标注，配合对应的注解处理器完成`Bean`的自动配置工作。默认按照 `Bean` 的类型进行装配。 |
| `@Resource`   | 作用与`Autowired`一样，区别在于`@Resource` 默认按照 `Bean`实例名称进行装配 |
| `@Qualifier`  | 与 `@Autowired`注解配合使用，会将默认的按 `Bean` 类型装配修改为按 `Bean` 的实例名称装配，`Bean` 的实例名称由 `@Qualifier` 注解的参数指定。 |

## Spring AOP（ Aspect Oriented Programming ）

`AOP`（面向切面编程）和`OOP`（面向对象编程）类似，也是一种编程模式，`Spring AOP`是基于`AOP`编程模式的一个框架，它的使用有效减少了系统间的重复代码，达到了模块间的松耦合目的。

`AOP`采取横向抽取机制，取代了传统纵向继承体系的重复性代码，其应用主要体现在事务处理、日志管理、权限控制、异常处理等方面。 

为了更好的理解`AOP`，需要了解相关的术语：

| 名称                  | 描述                                                         |
| --------------------- | ------------------------------------------------------------ |
| `Joinpoint`（连接点） | 指那些被拦截到的点，在 `Spring` 中，可以被动态代理拦截目标类的方法。 |
| `Pointcut`（切入点）  | 指要对哪些 `Joinpoint` 进行拦截，即被拦截的连接点。          |
| `Advice`（通知）      | 指拦截到 `Joinpoint `之后要做的事情，即对切入点增强的内容。  |
| `Target`（目标）      | 指代理的目标对象。                                           |
| `Weaving`（植入）     | `Weaving`（植入）                                            |
| `Proxy`（代理）       | 指生成的代理对象。                                           |
| `Aspect`（切面）      | 切入点和通知的结合。                                         |

AspectJ是一个基于Java语言的AOP框架，使用AspectJ进行开发通常有两种方式：

#### 基于XML的声明式

```xml
<bean id="customerDao" class="" />
<bean id="myAspect" class=""></bean>
<aop:config>
    <aop:aspect ref="myAspect">
        <aop:pointcut expression="execution(指定要被增强方法)" id="myPointCut" />
        <aop:before method="myBefore" pointcut-ref="myPointCut" />
        <aop:after-returning method="myAfterReturning" pointcut-ref="myPointCut" returning="returnVal" />
        <aop:around method="myAround" pointcut-ref="myPointCut" />
        <aop:after-throwing method="myAfterThrowing" pointcut-ref="myPointCut" throwing="e" />
        <aop:after method="myAfter" pointcut-ref="myPointCut" />
    </aop:aspect>
</aop:config>
```

#### 基于Annotation的声明式

| 名称              | 描述                                                  |
| ----------------- | ----------------------------------------------------- |
| `@Aspect`         | 用于定义一个切面。                                    |
| `@Before`         | 用于定义前置通知，相当于 `BeforeAdvice`。             |
| `@AfterReturning` | 用于定义后置通知，相当于 `AfterReturningAdvice`。     |
| `@Around`         | 用于定义环绕通知，相当于`MethodInterceptor`。         |
| `@AfterThrowing`  | 用于定义抛出通知，相当于`ThrowAdvice`。               |
| `@After`          | 用于定义最终final通知，不管是否异常，该通知都会执行。 |

要使用基于`Annotation`，首先需要在`Xml`中进行配置，开启切面的自动代理

```xml
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```

## Spring JDBCTemplate

Spring框架针对数据库开发中的应用提供了JDBCTemplate类，它提供了所有对数据库操作功能的支持。

```xml
<context:property-placeholder location="classpath:c3p0-db.properties" />
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    <property name="driverClass" value="${jdbc.driverClass}" />
    <property name="jdbcUrl" value="${jdbc.jdbcUrl}" />
    <property name="user" value="${jdbc.user}" />
    <property name="password" value="${jdbc.password}" />
</bean>
<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
    <property name="dataSource" ref="dataSource" />
</bean>
```

#### Spring事务管理接口

**1）PlatformTransactionManager**

`PlatformTransactionManager `接口是 Spring 提供的平台事务管理器，用于管理事务。该接口中提供了三个事务操作方法，具体如下 :

+ `TransactionStatus getTransaction(TransactionDefinition definition)`：用于获取事务状态信息。
+ `void commit(TransactionStatus status)`：用于提交事务。
+ `void rollback(TransactionStatus status)`：用于回滚事务。

**2）TransactionDefinition**

 `TransactionDefinition` 接口是事务定义（描述）的对象，它提供了事务相关信息获取的方法，其中包括五个操作，具体如下：

+ `String getName()`：获取事务对象名称。
+ `int getIsolationLevel()`：获取事务的隔离级别。
+ `int getPropagationBehavior()`：获取事务的传播行为。
+ `int getTimeout()`：获取事务的超时时间。
+ `boolean isReadOnly()`：获取事务是否只读。

**3）TransactionStatus**

` TransactionStatus` 接口是事务的状态，它描述了某一时间点上事务的状态信息。其中包含六个操作，具体如下：

+  `void flush() `： 刷新事务 
+ ` boolean hasSavepoint()` ： 获取是否存在保存点 。
+ ` boolean isCompleted() `： 获取事务是否完成 。
+ ` boolean isNewTransaction() `： 获取是否是新事务 。
+ ` boolean isRollbackOnly()` ： 获取是否回滚 。
+  `void setRollbackOnly()` ： 设置事务回滚 。

#### 基于Xml实现事务管理器

```xml
<bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<property name="dataSource" ref="dataSource" />
</bean>
<tx:advice id="txAdvice" transaction-manager="txManager">
    <tx:attributes>
        <tx:method name="" propagation="SUPPORTS" rollback-for="Exception" />
        <tx:method name="" propagation="REQUIRED" isolation="DEFAULT" read-only="false" />
    </tx:attributes>
</tx:advice>
<aop:config>
    <aop:pointcut expression="execution()" id="txPointCut" />
    <aop:advisor pointcut-ref="txPointCut" advice-ref="txAdvice" />
</aop:config>
```

#### 基于Annotation实现事务管理器

首先在容器中注册驱动

```xml
<tx:annotation-driven transaction-manager="txManager"/>
```

然后在使用事务的业务类或者方法中使用注解`@Transactional`

