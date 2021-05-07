---
title: XML
date: 2021-05-05 13:32:50
categories:
- Java Web
tags:
---

## 概念

Extensible Markup Language 可扩展标记语言。

功能：主要用来存储数据

1. 配置文件
2. 在网络中传输

## 语法

### 基本语法：

xml文档名的后缀名.xml

xml第一行必须定义为文档声明

xml文档中有且仅有一个根标签

属性值必须使用引号（单双引号都可）引起来

标签必须正确关闭

xml标签名称区分大小写

### 快速入门

```xml
<?xml version="1.0">
<users>
	<user id='1'>
  		<name>张三</name>
  		<age>23</age>
	</user>
</users>

```

**文档声明**

1. 格式：

   ```xml
   <?xml 属性列表?>
   ```

2. 属性列表：

   version：版本号 ，必须的属性

   encoding：编码方式。告诉 解析引擎当前文档使用的字符集，默认值：ISO-8859-1

   standalone：是否独立（yse：不依赖其他文件，no：依赖其他文件）

**标签**

标签名称是自定义的

**属性**

id属性值唯一

**文本**

CDATA区：在该区域中的数据会被原样展示

```xml
<![DATA[ 数据 ]]>
```

## 约束

规定xml文档的书写规则

### 分类

DTD：一种简单的约束技术

+ 内部dtd：将约束规则定义在xml文档中

+ 外部dtd：释放约束的规则定义在外部的dtd文件中
  + 本地：`<!DOCTYPE 根标签名 SYSTEM "dtd文件的位置">`
  + 网络：`<!DOCTYPE 根标签名 PUBLIC "dtd文件名字" "dtd文件的位置URL">`

Schema：一种复杂的约束技术

1. 填写xnl文档的根元素

2. 引入xsi前缀，`xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`

3. 引入xsd文件命名空间。`xsi:schemaLocation="http://www.itcast.cn/cml student.xsd"`

4. 为每一个xsd约束声明一个前缀，作为标识 `xmlns="http://www.itcast.cn/xml"`

## 解析

解析：将文档中的数据读取到内存中

写入：将内存中的数据保存到xml文档中。持久化的存储

### 解析xml的方式

**DOM**：将标记语言文档一次性加载进内存，在内存中形成一颗dom树

优点：操作方便，可以对文档进行CRUD的所有操作

缺点：占内存

**SAX**：逐行读取，基于事件驱动的。

优点：不占内存

缺点：只能读取，不能增删改。

### xml常见的解析器：

**JAXP**

**DOM4J**

**Jsoup**：是一款Java的解析器，可直接解析某个URL地址、HTML文本内容。

快速入门

```java
String path = JsoupDemo.getClassLoader().getResource("student.xml").getPath();
Document document = Jsoup.parse(new File(path), "utf-8");
Elements elements = document.getElementsByTag("name");
Element element = elements.get(0);
String name = element.text();
```

对象的使用

+ Jsoup：工具类，可以解析html或xml文档，返回Document

  ```java
  // 方式一
  parse(File in, String charsetName); // 解析xml或html文件
  // 方式二
  parse(String html); // 解析xml或html字符串
  // 方式三（可以用该方式做爬虫相关的工作）
  parse(URL url, int timeoutMillis); // 通过网络获取指定路径的html或xml的文档对象
  ```

+ Document：文档对象。代表内存中的Dom树

  ```java
  getElementById(String id); // 根据id属性值获取唯一的Element对象
  getElementsByTag(String tagName);
  getElementsByAttribute(String key);
  getElementsByAttributeValue(String key, String value);
  ```

+ Elements：元素Element对象的集合。可以当作`ArrayList<Element>`来使用

+ Elment：元素对象

  获取子元素

  ```java
  getElementById(String id); // 根据id属性值获取唯一的Element对象
  getElementsByTag(String tagName);
  getElementsByAttribute(String key);
  getElementsByAttributeValue(String key, String value);
  ```

  获取属性值

  ```java
  String attr(String key); // 根据属性名获取属性值
  ```

  获取文本内容

  ```java
  String text(); // 只获取所有子标签的文本内容
  String html(); // 获取标签体的所有内容（包括子标签的标签和文本内容）
  ```

  

+ Node：节点对象（是Document和Element的父类）

快捷的查询方式

+ selector：选择器

  ```java
  Elements select(String cssQuery)
  ```

+ Xpath：Xpath即为XML路径语言，它是一种用来确定XML文档中某部分位置的语言

  根据document对象创建JXDocument对象

  ```java
  JxDocument jxDocument = new JXDocument(document)
  ```

  结合XPath语法查询

  ```java
  List<JXNode> jxNodes = jxDocument.selN("//student"); // 查询所有的student标签
  List<JXNode> jxNodes = jxDocument.selN("//student/name"); // 查询所有的student标签下的所有name标签
  List<JXNode> jxNodes = jxDocuemnt.selN("//student/name[@id]"); // 查询带有id属性的name标签
  List<JXNode> jxNodes = jxDocuemnt.selN("//student/name[@id='itcast']"); // 查询带有id属性的name标签,并且属性值为itcast
  ```

**PULL**