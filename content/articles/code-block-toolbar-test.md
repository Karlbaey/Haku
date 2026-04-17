---
title: "代码块标题栏本地测试样例"
date: 2026-04-05
description: "仅用于本地验证代码块文件名和语言工具栏的边界情况。"
lastmod: 2026-04-05
draft: false
tags:
  - "测试"
  - "代码块"
slug: "code-block-toolbar-test"
---

这篇文章只用于本地手动验证代码块标题栏，不用于正式发布。

## 1. 普通短文件名

```ts {title="app.ts"}
export function greet(name: string) {
  return `Hello, ${name}`;
}
```

## 2. 无 title 时不显示工具栏

```ts
export const plainBlock = true;
```

## 3. 极长文件名

```fortran-fixed-form {title="_this__is__a__very__long__title__that__no__one__would__ever__use__in__proper__files.f"}
*     euclid.f (FORTRAN 77)
*     Find greatest common divisor using the Euclidean algorithm

      PROGRAM EUCLID
        PRINT *, 'A?'
        READ *, NA
*     其余部分省略……
```

## 4. 极长语言名

```objective-javascript-based-on-type-challenges-of-typescript {title="feature.experimental.spec.ts"}
type DeepMerge<T, U> = {
  [K in keyof T | keyof U]:
    K extends keyof U
      ? U[K]
      : K extends keyof T
        ? T[K]
        : never;
};
```

## 5. 文件名和语言都很长

```objective-javascript-based-on-type-challenges-of-typescript {title="_this__is__a__very__long__title__that__should__still__truncate__cleanly__inside__the__toolbar__component__without__breaking__layout__.spec.ts"}
export const status = "stress-case";
```

## 6. 中文与空格文件名

```css {title="深色 模式 按钮 样式.css"}
.toolbar-button {
  border-radius: 999px;
  padding: 0.5rem 0.9rem;
}
```

## 7. 没有语言但有 title

```text {title="README.local"}
This block has a title but no explicit language.
It should still render a title bar without breaking the layout.
```

## 8. 混用 title 与高亮元信息

```js {title="toolbar-state.js" hl_lines=[2]}
const state = {
  active: true,
  collapsed: false,
};
```

## 9. 超长单行代码

```ts {title="single-line-overflow.ts"}
export const url = "https://example.com/this/is/a/very/long/path/that/should/not/affect/the/title/bar/layout/even/when/the/code/content/is/also/very/long";
```
