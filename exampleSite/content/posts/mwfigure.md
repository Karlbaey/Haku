---
title: "MediaWiki Style Figure Demo"
date: 2026-04-26
tags: ["hugo", "shortcode", "layout"]
description: "Preview of the mwfigure shortcode with float, wrap, and bleed."
---

`mwfigure` 是一个专门给正文图文混排准备的 shortcode。它和默认 Markdown 图片分开，只有在你明确调用时，才会启用浮动、环绕和轻微破边。

{{< mwfigure
  src="/images/mwfigure-demo.svg"
  side="right"
  width="300px"
  bleed="4rem"
  title="Right-floated frame"
  caption="图片框会占正文的一部分宽度，正文内容自然绕排在左侧。这一版默认带边框和说明区，接近 MediaWiki 常见的图片框语义。"
/>}}

这一段正文用于验证右浮动场景。理想效果不是把图片生硬地夹在两个段落之间，而是让它像版式元素一样嵌进正文侧边，文字顺着图片框的边界自然流动。这类布局尤其适合注释图、旁证图、人物肖像、小型截图和需要就近说明的插图。

如果正文足够长，读者会在阅读时持续感知到图片与文本之间的关联，而不是先读完一大段，再回头找图片说明。也正因为如此，这个组件不应该替代常规的大图插图，而应该只用于确实需要“图文并行阅读”的内容。

有些版式还会故意让图片轻微突破正文边界，形成一种“伸到栏外”的视觉张力。这个主题里的实现会根据当前视口剩余留白限制负边距，尽量避免桌面窄窗口出现横向溢出。

{{< mwfigure src="https://cdn.nodeimage.com/i/xajEkzMO2dY73fiWN0d72EkgAPnb9jFi.webp" side="left" width="20rem" title="在演示站中展示" >}}
因为灵感来源与 mediawiki 展示人物肖像，就直接拿来永，还管它叫做 `mwfigure`。
{{< /mwfigure >}}

下面这段正文继续验证左浮动场景。通常在一篇文章里，不建议左右浮动来回切得过于频繁，否则阅读节奏会变碎；但作为一个演示页，这里保留两种方向，方便直接比较版面差异。

在移动端，组件会自动取消浮动，退化为普通块级图片框。因为窄屏上的文字环绕通常会压缩得过于局促，牺牲可读性，那里更合理的做法是让图片和说明完整占据一行宽度。
