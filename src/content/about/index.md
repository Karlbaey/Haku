---
title: "关于我"
---

你好啊！

这是 `about` 页面用到的源代码。

```astro
---
import { getEntry } from "astro:content";
import Layout from "../layouts/Layout.astro";

const entry = await getEntry("about", "index");

if (!entry) {
  throw new Error("未找到 src/content/about/index.md 文件");
}
const { Content } = entry ? await entry.render() : { Content: null };
---

<Layout articleTitle={entry.data.title}>
  <h1>{entry.data.title}</h1>
  {Content && <Content />}
</Layout>

```
