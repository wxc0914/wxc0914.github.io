---
title: Lambda表达式
date: 2021-04-05 13:32:50
categories: 
- Java
tags:
---

## 什么是lambda表达式？

## 概念

lambda表达式，也可以成为闭包，lambda表达式允许把函数作为一个方法的参数。

lambda表达式就是一个代码块，以及必须传入代码的变量规范，可以在以后执行一次或者多次。

## 语法

总的概括来说，它的格式是这样的：( 参数 ) -> { 表达式 }

先看一种最简单的：
```java
(String first, String second) -> first.length() - second.length();
```
如果代码要完成的计算无法放在一个表达式中，就可以像写方法一样，把这些代码放在{}中：
```java
(String first, String second) -> {
	if (first.length() < second.length()) return -1;
	else if (frist.length() > second.length()) return 1;
	else return 0;
}
```
即使lambda表达式没有参数，仍然要提供空括号，就像无参数方法一样：
```java
() -> {for (int i = 100; i >= 0; i--) System.out.println(i);} 
```

如果可以推导出一个lambda表达式的参数类型，可以忽略其类型。比如下面的例子，编译器可以推导出first和second的类型必然是字符串，因为这个lambda表达式将赋值给一个字符串比较器：
```java
Comparator<String> comp = (first, second) -> frist.length() - second.length();
```

如果方法参数只有一个，而且这个参数的类型还可以推导得出，那么甚至还可以省略小括号：
```java
ActionListener listener = event -> System.out.println("The time is " + new Date())
```

无需指定lambda表达式的返回类型，因为返回类型总是会由上下文推导得出。
+ 注： 如果lambda表达式只在某些分支返回一个值，而在另外一些分支不返回值，是不合法的。

### 函数式接口

对于只有一个抽象方法的接口，需要这种接口的对象时，就可以提供一个lambda表达式。这种接口称为函数式接口。

先看一个简单的例子，数组排序：
```java
Array.sort(words, (first, second) -> first.length() - second.length())
```
对象和类的管理完全取决于具体实现，与使用传统的内联类相比，这样可能要高效得多。最好把lambda表达式看作是一个函数，而不是一个对象，另外要接受lambda表达式可以传递到函数式接口。

再看一个例子，感受下lambda表达式转换为函数式接口的魅力：
```java
Timer t = new Timer(1000, event -> {
	System.out.println("At the tone, the time is " + new Date());
	Toolkit.getDefaultToolkit().beep();
})
```

### 方法引用

有时，可能已经有现成的方法可以完成我们想要传递到其他代码的某个动作。这个时候我们就可以使用方法引用。

方法引用等价于提供方法参数的lambda表达式。

先看一个例子
```java
Timer t = new Timer(1000, System.out::println)
```
这里面的`System.out::println`是一个方法引用，他等价于lambda表达式`x -> System.out.println(x)`

还有的例子，比如说：`Math::pow`等价于`(x, y) -> Mathpow(x, y)`

要用 `::` 操作符分隔方法名与对象或类名，主要分为三种情况：
+ object::instaceMethod
+ Class::staticMethod
+ Class::instanceMethod

可以在方法引用中使用this参数，使用super也是合法的。

+ 注： 类似于lambda表达式，方法引用不能独立存在，总是会转换为函数式接口的实例。

### 构造器引用

构造器引用与方法引用很类似，只不过方法名为new。

可以用数组类型建立构造器引用，`int[]::new`是一个构造器引用，他有一个参数，即数组的长度。这等价于lambda表达式`x -> new int[x]`

Java有一个限制，无法构造泛型类型T的数组，数组构造器引用对于克服这个限制很有用。

例如，我们需要一个Person对象数组。Stream接口有一个toArray方法可以返回Object数组：

```java
Object people = stream.toArray();
```

不过这并不让人满意。用户希望得到一个Person引用数组，而不是Obejct引用数组。因此我们可以这么解决：

```java
Person[] people = stream.toArray(Person[]::new);
```

### 变量作用域 
lambda表达式可以捕获外围作用域中变量的值。在Java中，要确保所捕获的值是明确定义的，这里有一个重要的限制。在lambda表达式中，只能引用值不会改变的变量。

这里有几个点需要注意：
+ lambda表达式捕获的变量必须实际上是最终变量，实际上的最终变量是指，这个变量初始化之后就不会再为它赋新值。
+ lambda表达式的体与嵌套快有相同的作用域。在lambda表达式中声明与一个局部变量同名的参数或局部变量是不合法的。
+ 在一个lambda表达式中使用this关键字时，是指创建这个lambda表达式的方法的this参数。

lambda 表达式或者匿名内部类不能访问非 final 的局部变量，为什么呢？

其实这就要说到Jvm内存模型和线程了，因为实例变量存在堆中，而局部变量是在栈上分配，lambda 表达(匿名内部类) 会在另一个线程中执行。如果在线程中要直接访问一个局部变量，可能线程执行时该局部变量已经被销毁了，而 final 类型的局部变量在 Lambda 表达式(匿名类) 中其实是局部变量的一个拷贝。
