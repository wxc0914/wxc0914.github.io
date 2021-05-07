---
title: Servlet
date: 2021-05-05 13:32:50
categories:
- Java Web
tags:
---

## 概念

Servlet（server applet 运行在服务器端的小程序）：Servlet就是一个接口，定义了Java类被浏览器访问到（tomcat识别）的规则。

## 快速入门

实现Servlet接口

```java
public class ServletDemo(Ser) implements Servlet {
    
    /**
    初始化方法，在servlet被创建时执行，只执行一次。
    */
    @Override
    public void init(ServletConfig servletConfig) throw ServletException {
        
    }
    
    /**
    获取ServletConfig对象(ServletConfig: Servlet的配置对象)
    */
    @Override
    public ServletConfig getServletConfig() {
        return null;
    }
   
    /**
    提供服务方法，每一次Servlet被访问时执行
    */
    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throw ServeletException {
        
    }
    
    /**
    获取Servlet的一些信息
    */
    @Override
    public String getServletInfo() {
        return null;
    }
    
    /**
    销毁方法，在服务器正常关闭时执行，只执行一次。
    */
    @Override
    public void destroy() {
        
    }
    
}
```

在web.xml中配置Servlet

```xml
<servlet>
    <servlet-name>demo</servlet-name>
    <servlet-class>cn.weixiaochen.web.servlet.Servlet.ServletDemo</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>demo</servlet-name>
    <url-pattern>/demo</url-pattern>
</servlet-mapping>
```

## Servlet生命周期

### init()

默认第一次被访问时Servlet被创建。但也可以配置Servlet的创建时机：

```xml
<servlet>
    ...
    <!--值为正数，启动时创建；值为负数，第一次访问时创建。-->
    <load-on-startup></load-on-startup>
    ...
</servlet>
```

Servlet的init方法，只执行一次，说明一个Servlet在内存中只存在一个对象，Servlet是单例的。

多个用户同时访问时，可能存在线程安全问题，所以尽量不要在Servlet中定义成员变量。

### service()

每次访问Servlet时，Service方法都会被调用一次。

### destroy()

服务器正常关闭时，执行destroy方法，Servlet被销毁。

## Servlet 3.0

优点：支持注解配置，可以不需要web.xml

```java
@WebServlet("资源路径")
public class ServletDemo implements Servlet  {
    
}
```

## Servlet体系结构

### GenericServlet

是一个抽象类，将Servlet接口中其他的方法做了默认空实现，只有service方法是抽象方法。

### HttpServlet

对http协议的一种封装，简化操作。

## Servlet相关配置

### urlPattern

一个Servlet可以定义多个访问路径。

路径定义规则：`/xxx`、`/xxx/xxx`、`*.do`。

## Http

### 概念

Hyper Text Transfer Protocol 超文本传输协议

### 特点

基于TCP/IP的高级协议。

默认端口号：80。

基于请求/响应模型：一次请求对应一次响应。

无状态的：每次请求之间相互独立。

### 历史版本

1.0：每一次请求响应都会建立新的连接

1.1： 复用连接

### 请求消息数据格式

+ 请求行

  请求方式：HTTP协议中有7种请求方式，常用的有两种：

  + GET：请求参数在请求行中，在url后；请求的url长度有限制的；不太安全
  + POST：请求参数在请求体中；请求的url长度没有限制；相对安全

+ 请求头

  常见的请求头：

  + User-Agent：告诉服务器，浏览器的版本信息。
  + Refere:  告诉服务器，当前请求从哪个页面传来。

+ 请求空行

  用于分隔POST请求的请求体和请求头

+ 请求体

  封装POST请求的请求参数

### 响应消息数据格式

+ 响应行

  响应状态码：

  + 1XX：服务器接收客户端消息，但没有接收完成，等待一段事件后，发送1XX状态码。
  + 2XX：成功。
  + 3XX：重定向。302（重定向），304（访问缓存）
  + 4XX：客户端错误。404（请求路径没有对应的资源），405（请求方式没有对应的方法）
  + 5XX：服务器错误。500（服务器内部出现异常）

+ 响应头

  常见响应头：

  + Content-Type：服务器告诉客户端本次响应体数据格式以及编码格式。

  + Content-disposition：服务告诉客户端以什么格式打开响应体数据。

    in-line：默认值，在当前页面打开。

    attachment：以附件形式打开响应体。

+ 响应空行

+ 响应体

## Request

### 体系结构

`RequestFacade` implements `HttpServletRequest` extends `ServletRequest`

### 获取请求行数据

```java
// 获取请求方式
String getMethod();
// 获取虚拟目录
String getContextPath();
// 获取Servlet路径
String getServletPath();
// 获取get方式请求参数
String getQueryString();
// 获取请求url
String getRequestURI();
StringBuffer getRequestURL();
// 获取协议及版本
String getProtocol();
// 获取客户机IP地址
String getRemoteAddr();
```

### 获取请求头数据

```java
// 通过请求头的名称获取请求头的值
String getHeader(String name);
// 获取所有的请求头名称
Enumeration<String> getHeaderNames()
```

### 获取请求体数据

```java
// 第一步：获取流对象
BufferedReader getReader(); // 获取字符输入流，只能操作字符数据类型
ServletInputStream getInputStream(); // 获取字节输入流，可以操作所有类型的数据
// 第二步：从流对象中提取数据
```

### 获取请求参数通用方式

```java
// 感觉参数名称获取参数值
String getParameter(String name);
// 根据参数名称获取参数值的数组
String[] getParameterValues(String name);
// 获取所有请求的参数名称
Enumeration<String> getParameterNames();
// 获取所有参数的Map集合
Map<String, String[]> getParameterMap();
```

### 请求转发：一种在服务器内部的资源跳转方式

浏览器地址栏不发生变化。

只能转发到当前服务器内部资源中。

转发是一次请求

```java
// 通过request对象获取请求转发对象
RequestDispatcher getRequestDispatcher("资源路径");
// 通过RequestDispatcher对象来进行转发
forward(ServletRequest request, ServletResponse response);
```

### 共享数据

域对象：一个有作用范围的对象，可以在范围内共享数据。

request域：代表一次请求的范围，一般用于请求转发的多个资源中共享数据

```java
// 存储数据到request域中
void setAttribute(String name, Object obj);
// 通过键获取键值对
Object getAttribute(String name);
// 通过建移除键值对
void removeAttribute(String name);
```

### 获取ServletContext

```java
ServletContext getServletContext();
```

## Response

### 设置响应行

```java
setStatus(int sc);
```

### 设置响应头

```java
setHeader(String name, String value);
setContentType("text/html;charset=utf-8")
```

### 设置相应体

```java
// 获取输出流
PrintWriter getWriter(); // 字符流
ServletOutputStream getOutputStream(); // 字节流
// 使用输出流，将数据输出到客户端浏览器
```

### 重定向

地址栏发生变化

重定向可以访问其他站点（服务器）的资源

重定向是两次请求，不能使用request来共享数据

## ServletContext

代表整个web应用，可以和程序的容器（服务器）来通信。

### 功能

+ 获取MIME类型

  MIME类型：在互联网通信过程中定义的一种文件数据类型。

  ```java
  String getMimeType(String file);
  ```

+ 域对象：共享数据

  ServletContext对象范围：所有用户的请求数据。

+ 获取文件的真实（服务器）路径