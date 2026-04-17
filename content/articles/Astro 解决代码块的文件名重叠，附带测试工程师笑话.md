---
title: Astro 解决代码块的文件名重叠，附带测试工程师笑话
pubDate: 2026-02-22T18:22:47.123Z
description: "一个测试工程师走进一家酒吧，要了一杯啤酒；一个测试工程师走进一家酒吧，要了一杯咖啡……没完了？（附带绝赞调优记录）"
updated: ""
tags:
  - Astro
  - 前端
  - 胡言乱语
draft: false
pin: 0
toc: true
lang: ""
permalink: "solving-a-duplicate-filename-bug-and-a-test-engineer-joke"
---

很久以前咱就听过一个测试工程师笑话。保守估计这笑话年纪比咱还大。

> 一个测试工程师走进一家酒吧，要了一杯啤酒；
>
> 一个测试工程师走进一家酒吧，要了一杯咖啡；
>
> 一个测试工程师走进一家酒吧，要了0.7杯啤酒；
>
> 一个测试工程师走进一家酒吧，要了-1杯啤酒；
>
> 一个测试工程师走进一家酒吧，要了2^32杯啤酒；
>
> 一个测试工程师走进一家酒吧，要了一杯洗脚水；
>
> 一个测试工程师走进一家酒吧，要了一杯蜥蜴；
>
> 一个测试工程师走进一家酒吧，要了一份asdfQwer@24dg!&\*(@；
>
> 一个测试工程师走进一家酒吧，什么也没要；
>
> 一个测试工程师走进家酒吧，又走出去又从窗户进来又从后门出去从下水道钻进来；
>
> 一个测试工程师走进家酒吧，又走出去又进来又出去又进来又出去，最后在外面把老板打了一顿；
>
> 一个测试工程师走进一；
>
> 一个测试工程师走进一家酒吧，要了一杯烫烫烫的锟斤拷；
>
> 一个测试工程师走进一家酒吧，要了NaN杯Null；
>
> 一个测试工程师冲进一家酒吧，要了500T啤酒咖啡洗脚水野猫狼牙棒奶茶；
>
> 一个测试工程师把酒吧拆了；
>
> 一个测试工程师化装成老板走进一家酒吧，要了500杯啤酒，并且不付钱；
>
> 一万个测试工程师在酒吧外呼啸而过；
>
> 一个测试工程师走进一家酒吧，要了一杯啤酒‘;DROPTABLE酒吧；
>
> 测试工程师们满意地离开了酒吧；
>
> 然后一名顾客点了一份炒饭，酒吧炸了。

然后就想到了我最近搞的一个小东西。是个 Astro 框架的博客主题。我给这加了个功能：作者可以给自己的代码块加一个文件名，同样可以自动展示语言是什么。

然后我就想，如果某作者闲得蛋疼搞出一个特别长的文件名和语言名，那不就是会重叠吗？所以我上 [Shiki](//shiki.style) 找了找最长的语言名，还真给我找到了，是 Fortran 的一种格式标准 `fortran-fixed-form`。所以就有了下面的逆天玩意。

源代码：

````markdown
```fortran-fixed-form title="_this__is__a__very__long__title__that__no__one__would__ever__use__in__proper__files.f"
*     euclid.f (FORTRAN 77)
*     Find greatest common divisor using the Euclidean algorithm

      PROGRAM EUCLID
        PRINT *, 'A?'
        READ *, NA
*     其余部分省略……
```
````

哈哈，不出所料。

![_image](https://cdn.nodeimage.com/i/i1TODTkR4qzfkJckHdjXOzlXoGRb8gXR.png)

然后就是改呗。总之改完的 CSS 长这样。

```css title="markdown.css"
.markdown {
  /* 文件名标题栏 (自动生成的 figcaption) */
  figure[data-rehype-pretty-code-figure] figcaption {
    /* ... */
    padding: 0.5rem 1rem;
    padding-right: 9rem;
    /* ... */

    /* 防止文件名太长换行 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 嗯这是一个位置 */
  figcaption[data-rehype-pretty-code-title] {
    position: relative;
  }

  /* 语言显示 (利用 figure 上的 data-language 属性) */
  figcaption[data-rehype-pretty-code-title][data-language]::after {
    content: attr(data-language);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    padding-inline: 1rem;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
  }
}
```

效果很好，很适合我。

![_image](https://cdn.nodeimage.com/i/3LKRXBzeTN7iOF1rMDp6bya2yCAYUAuD.png)

![_image](https://cdn.nodeimage.com/i/jgIUJehm3che6I5ZiuYC6oAgxQzFDJzr.png)

但是如果有个天才，想出一门新语言，标记 ID 叫做 `objective-javascript-based-on-type-challenges-of-typescript`，那我又该怎么办呢。

:::fold[我真这么搞了]

![_image](https://cdn.nodeimage.com/i/x3gO727Cw8lioOdOjbRUZTjvj40x6fF0.png)

移动端表现：

![_image](https://cdn.nodeimage.com/i/mc6jZGD4J03BCSCArhfiCE3y1La6GtG4.png)

想出一门这么牛逼的语言，该它崩溃。

:::

嗯对，刚才想洗个澡，结果把水龙头拧开发现花洒不出水，真把我紧张坏了。然后把浴室里的另外几个水龙头也打开，发现有水啊。最后跟花洒大眼瞪小眼，发现是花洒上的龙头没有开。
