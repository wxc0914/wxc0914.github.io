---
title: SpringMVC
date: 2021-04-05 13:32:50
categories:
- Spring
tags:
---

## SpringMVC简介

SpringMVC是spring提供给Web应用的框架设计。

#### MVC设计模式

 MVC 是 Model、View 和 Controller 的缩写，分别代表 Web 应用程序中的 3 种职责：

+ 模型：用于存储数据以及处理用户请求的业务逻辑。
+ 视图：向控制器提交数据，显示模型中的数据。
+ 控制器：根据视图提出的请求判断将请求和数据交给哪个模型处理，将处理后的有关结果交给哪个视图更新显示。

#### SpringMVC 工作流程

基于`Servlet`的MVC模式具体实现如下：

+ 模型：一个或多个 JavaBean 对象，用于存储数据（实体模型，由 JavaBean 类创建）和处理业务逻辑（业务模型，由一般的 Java 类创建）。
+ 视图：一个或多个 JSP 页面，向控制器提交数据和为模型提供数据显示，JSP 页面主要使用 HTML 标记和 JavaBean 标记来显示数据。

- 控制器：一个或多个 Servlet 对象，根据视图提交的请求进行控制，即将请求转发给处理业务逻辑的  JavaBean，并将处理结果存放到实体模型 JavaBean 中，输出给视图显示。

SpringMVC框架主要由DispatcherServlet、HandlerMapping、HandlerAdapter、Controller、ViewResolver、View组成，详细的工作流程可分以下几步：

1. 客户端请求提交到DispatcherServlet。
2. 由DispatcherServlet控制器寻找一个或多个HandlerMapping，找到处理请求的Controller。
3. DispatcherServlet将请求提交到Controller。
4. Controller调用业务逻辑后返回ModelAndView。
5. DispatcherServlet寻找一个或多个ViewResolver试图解析器，找到ModelAndView指定的试图。
6. 试图负责将结果显示到客户端。

## ViewResolver 视图解析器

试图解析器是SpringMVC中的重要组成部分，用户可在springmvc.xml文件中定义一个试图解析器

```xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" >
    <!--前缀-->
    <property name="prefix" value="/WEB-INF/jsp/"/>
    <!--后缀-->
    <property name="suffix" value=".jsp"/>
</bean>
```

其中InternalResourceViewResolver 继承于URLBasedViewResolver 。

不同的是，InternalResourceViewResolver是内部资源试图解析器，这也是它的特性。 它会把返回的视图名称都解析为InternalResourceView对象，InternalResourceView会把Controller处理器方法返回的模型属性都存放到对应的request属性中，然后通过RequestDispatcher在服务器端把请求forword重定向到目标URL。 

## Controller 控制器

基于注解的控制器类需要在springmvc.xml中使用扫描机制：

```xml
<context:component-scan base-package="com.controller">
```

除此之外，还要配置注解驱动。 <mvc:annotation-driven /> 会自动注册 RequestMappingHandlerMapping 和 RequestMappingHandlerAdapter 这两个Bean，这是SpringMVC实现Controller分发请求、json自动转换等功能所必须的。

```xml
<mvc:annotation-driven />
```

使用@Controller和@RequestMapping编写一个控制器：

```java
@Controller
@RequestMapping("/index")
public class IndexController {
    @RequestMapping("/login")
    public String login() {
        return "login";
    }
}
```

#### 获取参数

Controller接受请求参数的方式有很多种，有的适合get，有的适合post请求方式，有的两者都适合。

**通过实体Bean接收请求参数**

适用于get、post提交请求方式。 需要注意的是， 通过一个实体 Bean 来接收请求参数 ，Bean 的属性名称必须与请求参数名称相同 。

```java
// User是一个实体Bean
public String login(User user, HttpSession session, Model model) {
    if ("username".equals(user.getUsername) && "password".equals(user.getPassword)){}
}
```

**通过处理方法的形参接受请求参数**

适用于get、post提交请求方式。直接把表单参数写在控制器类相应方法的形参中，即形参名称与请求参数名称完全相同。 

```java
public String login(String username, String password, HttpSession session, Model model) {
    if ("username".equals(username) && "password".equals(password)){}
}
```

**通过HttpServletRequest接受请求参数**

适用于get、post提交请求方式。

```java
public String login(HttpServletRequest request, HttpSession session, Model model) {
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    if ("username".equals(username) && "password".equals(password)){}
}
```

**通过@PathVariable接受URL中的请求参数**

通过 @PathVariable 获取 URL 中的参数 

```java
public String login(@PathVariable String username, @PathVariable String password, HttpSession session, Model model) {
    if ("username".equals(username) && "password".equals(password)){}
}
```

**通过@RequestParam接收请求参数**

适用于 get 和 post 提交请求方式 ， 当请求参数与接收参数名不一致时，“通过处理方法的形参接收请求参数”不会报 404 错误，而“通过 @RequestParam 接收请求参数”会报 404 错误。 

```java
public String login(@RequestParam String username, @RequestParam String password, HttpSession session, Model model) {
    if ("username".equals(username) && "password".equals(password)){}
}
```

**通过@ModelAttribute接收请求参数**

当 @ModelAttribute 注解放在处理方法的形参上时，用于将多个请求参数封装到一个实体对象，从而简化数据绑定流程，而且自动暴露为模型数据，在视图页面展示时使用。 

```java
public String login(@ModelAttribute("user") User user, HttpSession session, Model model) {
    if ("username".equals(user.getUsername) && "password".equals(user.getPassword)){}
}
```

被@ModelAttribute注解的方法将在每次调用该控制器类的请求处理方法前被调用。

#### 返回参数

请求处理方法中常见返回类型：String、ModelAndView、Model、View、任意Java类型。

#### 转发与重定向

**转发（服务器行为）：**

将用户对当前处理的请求转发给另一个试图或处理请求，以前的request中存放的信息不会失效。

```java
// 转发到一个请求方法
public String login() {
    return "forward:/index/isLogin";
}

// 转发到一个试图
public String isLogin() {
    return "index";
}
```

**重定向（客户端行为）：**

将用户从当前处理请求定向到另一个试图或处理请求，以前的request存放的信息全部失效，并进入一个新的request作用域。

客户浏览器发送 http 请求，Web 服务器接受后发送 302 状态码响应及对应新的 location 给客户浏览器，客户浏览器发现是 302 响应，则自动再发送一个新的 http 请求，请求 URL 是新的 location 地址，服务器根据此请求寻找资源并发送给客户。 

```java
// 重定向到一个请求方法
public String isLogin() {
    return "redirect:/index/isRegistor";
}
```

## Service

业务逻辑放在Service层。

@Autowired和@Service的使用同样需要包扫描

```xml
<context：component-scan base-package=“com.service”/>
```

实现一个服务

```java
@Service
public class UserServiceImpl implements UserService {
    public boolean login(User user) {
        if ("username".equals(user.getUsername) && "password".equals(user.getPassword)){}
    }
}
```

## 类型转换器

SpringMVC框架的Converter<S, T>是一个可以将一种数据类型转换成另一种数据类型的接口，这里S表示源类型，T表示目标类型。

对于常用的数据类型，SpringMVC提供了许多内置的类型转换器。也可以自定义类型转换器。

首先，编写转换器类。

```java
public class UserConverter implements Converter<String, User> {
    public User convert(String source) {
        ....
    }
}
```

然后，注册类型转换器

```xml
<!--使用我们自己配置的类型转换组件-->
<mvc:annotation-driven conversion-service="conversionService"/>
<bean id="conversionService" class="org.springframework.format.support.ConversionServiceFactoryBean">
    <property name="converters">
        <set>
            <bean class="com.atguigu.component.MyStringToEmployeeConverter"></bean>
        </set>
    </property>
</bean>
```

最后，使用转换器

```java
public String login(@RequestParam("user") String username, @RequestParam String password, HttpSession session, Model model) {
    if ("username".equals(username) && "password".equals(password)){}
}
```

SpringMVC框架中的Formatter< T >与Converter<S, T>一样，也是一个可以将一种数据类型转换成另一种数据类型的接口，不同的是，Formatter< T >的源数据类型必须为String。

## Interceptor 拦截器

 在 Spring MVC 框架中定义一个拦截器需要对拦截器进行定义和配置，定义一个拦截器可以通过两种方式：一种是通过实现 HandlerInterceptor 接口或继承 HandlerInterceptor 接口的实现类来定义；另一种是通过实现 WebRequestInterceptor 接口或继承 WebRequestInterceptor 接口的实现类来定义。 

```java
public class MyInterceptor implements HandlerInterceptor {
    // 该方法在控制器的处理请求方法执行完成后执行，即视图渲染结束后执行，可以通过此方法实现一些资源清理、记录日志信息等工作。
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
    
    // 该方法在控制器的处理请求方法调用之后、解析视图之前执行，可以通过此方法对请求域中的模型和视图做进一步的修改。
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }
    
    // 该方法在控制器的处理请求方法前执行，其返回值表示是否中断后续操作，返回 true 表示继续向下执行，返回 false 表示中断后续操作。
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return false;
    }
}
```

配置拦截器

```xml
<mvc:interceptors>
    <!-- 配置一个全局拦截器，拦截所有请求 -->
    <bean class="interceptor.MyInterceptor" /> 
    <mvc:interceptor>
        <!-- 配置拦截器作用的路径,  “/**”表示拦截所有路径  -->
        <mvc:mapping path="/**" />
        <!-- 配置不需要拦截作用的路径 -->
        <mvc:exclude-mapping path="" />
        <!-- 定义<mvc:interceptor>元素中，表示匹配指定路径的请求才进行拦截 -->
        <bean class="interceptor.Interceptor1" />
    </mvc:interceptor>
</mvc:interceptors>
```

**单个Interceptor执行流程**

在配置文件中如果只定义了一个拦截器，程序将首先执行拦截器类中的 preHandle 方法，如果该方法返回 true，程序将继续执行控制器中处理请求的方法，否则中断执行。如果 preHandle 方法返回 true，并且控制器中处理请求的方法执行后、返回视图前将执行 postHandle 方法，返回视图后才执行 afterCompletion 方法。 

**多个Interceptor执行流程**

在 Web 应用中通常需要有多个拦截器同时工作，这时它们的 preHandle 方法将按照配置文件中拦截器的配置顺序执行，而它们的 postHandle 方法和 afterCompletion 方法则按照配置顺序的反序执行。 

## SpringMVC数据验证

 在 Spring MVC 框架中先进行数据类型转换，再进行服务器端验证。 自定义Spring验证器 需要实现Validator 接口和 ValidationUtils工具类。 

```java
@Component
public class MyValidator implements Validator {
    // 当 supports 方法返回 true 时，验证器可以处理指定的 Class
    @Override
    public boolean supports(Class<?> class) {}
    
    //validate 方法的功能是验证目标对象 object，并将验证错误消息存入 Errors 对象
    @Override
    public void validate(Object object, Errors errors) {}
}
```

配置消息属性文件

```java
<bean id="messageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
	<property name="basename" value="/WEB-INF/resource/errorMessages" />
</bean>
```

## 统一异常处理

将所有类型的异常处理从各层中解耦出来，这样既保证了相关处理过程的功能单一，又实现了异常信息的统一处理和维护。 

#### SimpleMappingExceptionResolver类异常处理

```xml
<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
    <!-- 定义默认的异常处理页面，当该异常类型注册时使用 -->
    <property name="defaultErrorView" value="error"></property>
    <!-- 定义异常处理页面用来获取异常信息的变量名，默认名为exception -->
    <property name="exceptionAttribute" value="ex"></property>
    <!-- 定义需要特殊处理的异常，用类名或完全路径名作为key，异常页名作为值 -->
    <property name="exceptionMappings">
        <props>
            <prop key="exception.MyException">my-error</prop>
            <prop key="java.sql.SQLException">sql-error</prop>
            <!-- 在这里还可以继续扩展对不同异常类型的处理 -->
        </props>
    </property>
</bean>
```

#### HandlerExceptionResolver接口异常处理

```java
public class MyExceptionHandler implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("ex", arg3);
        // 根据不同错误转向不同页面（统一处理），即异常与View的对应关系
        if (arg3 instanceof MyException) {
            return new ModelAndView("my-error", model);
        } else if (arg3 instanceof SQLException) {
            return new ModelAndView("sql-error", model);
        } else {
            return new ModelAndView("error", model);
        }
    }
}
```

然后将实现类 MyExceptionHandler 在配置文件中托管给SpringMVC 框架才能进行异常的统一处理 

```xml
<bean class="exception.MyExceptionHandler"/>
```

#### 使用@ExceptionHandler注解异常处理

```java
public class BaseController {
    @ExceptionHandler
    public String exception(HttpServletRequest request, Exception ex) {
        request.setAttribute("ex", ex);
        // 根据不同错误转向不同页面，即异常与view的对应关系
        if (ex instanceof SQLException) {
            return "sql-error";
        } else if (ex instanceof MyException) {
            return "my-error";
        } else {
            return "error";
        }
    }
}
```

