---
title: String
date: 2021-05-05 13:32:50
categories:
- Java
tags:
---

### String

`String`对象的内部实现

```java
// java6
char[]、offset、count、hash
// java7/8
char[]、hash
// java9
byte[]、coder、hash
```

Java9中`String`类的`equals`方法

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    } else {
        if (anObject instanceof String) {
            String aString = (String)anObject;
            if (this.coder() == aString.coder()) {
                return this.isLatin1() ? StringLatin1.equals(this.value, aString.value) : 
             		  StringUTF16.equals(this.value, aString.value);
            }
        }
        return false;
    }
}
```



### StingBuffer、StringBuilder

`StringBuffer` 和`StringBuilder`类能够对其对象进行直接修改，他们都继承于`AbstractStingBuilder`。`StringBuffer`方法是线程安全的（采用synchronized修饰了父类方法），所以访问速度较慢。

```java
StringBuffer buffer = new StringBuffer("hello ");
buffer.append("world !");
```