---
title: Cookie和Session
date: 2021-05-05 13:32:50
categories:
- Java Web
tags:
---

## 会话技术

会话：一次会话中包含多次请求和响应。

功能：在一次会话的范围内的多次请求间，共享数据

## Cookie

概念：客户端会话技术，将数据保存到客户端。

快速入门：

```java
// 创建cookie对象，绑定数据
new Cookie(String name, String value);
// 发送cookie对象
response.addCookie(Cookie cookie);
// 获取cookie，拿到数据
request.getCookies();
```

实现原理：基于响应头set-cookie和请求头cookie实现。

cookie的细节：

+ 可以创建多个Cookie对象，使用response调用多次addCookie方法发送cookie即可。

+ 默认情况下，当浏览器关闭后，Cookie数据被销毁。

+ 持久化存储：

```java
  // 正数：将cookie数据写到硬盘的文件中，持久化存储。
  // 负数：默认值
  // 零：删除cookie信息
  setMaxAge(int seconds);
```

+ 在tomcat8以后，才支持存储中文数据。但是对特殊字符还是不支持。

+ 默认情况下，cookie会设置当前虚拟目录为共享范围。

```java
  // 调用这个方法，可以设置同意服务器下的多个项目共享范围。
  setPath(String path);
  // 如果一级域名相同，那么多个服务器之间可以共享。
  setDomain(String path);
```

cookie特点：

+ cookie存储数据在客户端浏览器。

+ 浏览器对于单个cookie的大小有限制（4KB）以及对同一个域名下的总cookie数量也有限制（20个）。

+ cookie一般用于存储少量的不太敏感的数据。

## Session

概念：服务端的会话技术，再一次会话的多次请求间共享数据，将数据保存在服务器端的对象中。

快速入门：

```java
// 获取session对象
HttpSession session = request.getSession();
// 使用session对象
Object getAtrribute(String name);
void setAtrribute(String name, Object object);
void removeAttribute(String name);
```

实现原理：Session的实现是依赖于cookie的。

session细节：

+ 当客户端关闭后服务器不关闭，两次获取session不是同一个。

+ 客户端不关闭，服务器不关闭，两次获取的session不是同一个。
  session的钝化：在服务器正常关闭之前，将session对象序列化到硬盘上。
  session的活化：在服务器启动后，将session文件转化为内存中的session对象。

+ session被销毁：服务器关闭、session对象调用invalidate()、session默认存活时间是30分钟。
  可以选择性修改配置

```xml
  <session-config>
      <session-timeout>30</session-timeout>
  </session-config>
```

session特点：

+ session用于存储一次绘画的多次请求的数据，存在服务器端。

+ session可以存储任意类型，任意大小的数据。

