<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><xsl:value-of select="/rss/channel/title" /> RSS</title>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #fbf9f8;
            --text: #1f2937;
            --heading: #1a1a1a;
            --muted: #6b7280;
            --meta: #6b6b6b;
            --subtle: #9ca3af;
            --accent: #517ad1;
            --accent-soft: #4c7bdf;
            --surface: #f6f2ef;
            --line: #ded7d2;
            --tag-pill-bg: #f0ece9;
            --tag-pill-border: #d8d3cf;
            --tag-pill-text: #2b211d;
            --tag-pill-active-bg: #e6dfda;
            --tag-pill-active-border: #c8bdb7;
            --tag-pill-active-text: #1f1713;
            --font-title: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "Georgia", "Times New Roman", serif;
            --font-body: "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            --font-body-en: "SN Pro", "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #111827;
              --text: #e5e7eb;
              --heading: #f3f4f6;
              --muted: #9ca3af;
              --meta: #9ca3af;
              --subtle: #6b7280;
              --accent: #a3ccf3;
              --accent-soft: #60aef7;
              --surface: #172033;
              --line: #2d3748;
              --tag-pill-bg: #1a2232;
              --tag-pill-border: #2d3748;
              --tag-pill-text: #f3f4f6;
              --tag-pill-active-bg: #263244;
              --tag-pill-active-border: #465165;
              --tag-pill-active-text: #ffffff;
            }
          }

          * {
            box-sizing: border-box;
          }

          html {
            font-size: 17px;
            line-height: 1.75;
            -webkit-text-size-adjust: 100%;
            text-rendering: optimizeLegibility;
          }

          body {
            margin: 0;
            min-height: 100vh;
            background: var(--bg);
            color: var(--text);
            font-family: var(--font-body-en), var(--font-body);
            letter-spacing: 0.015em;
          }

          a {
            color: var(--accent);
            text-decoration-thickness: 0.08em;
            text-underline-offset: 0.14em;
          }

          a:hover {
            color: var(--accent-soft);
          }

          .page {
            max-width: 760px;
            margin: 0 auto;
            padding: 4rem 0 5rem;
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            padding: 0.28rem 0.72rem;
            border: 1px solid var(--tag-pill-active-border);
            background: var(--tag-pill-active-bg);
            color: var(--tag-pill-active-text);
            border-radius: 999px;
            font-size: 0.82rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .title {
            margin: 1rem 0 0;
            font-size: clamp(2rem, 1.6rem + 1.2vw, 2.7rem);
            line-height: 1.2;
            letter-spacing: 0.03em;
            font-weight: 700;
            color: var(--heading);
            font-family: var(--font-title);
          }

          .description {
            margin: 0.75rem 0 0;
            color: var(--muted);
            font-size: 1rem;
          }

          .meta {
            margin-top: 1.4rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem 1rem;
            color: var(--meta);
            font-size: 0.92rem;
          }

          .panel {
            margin-top: 2rem;
            padding: 1rem 1.15rem;
            border: 1px solid var(--line);
            background: var(--surface);
          }

          .panel p {
            margin: 0;
            color: var(--muted);
          }

          .feed-list {
            list-style: none;
            padding: 0;
            margin: 2.2rem 0 0;
            border-top: 1px solid var(--line);
          }

          .feed-item {
            padding: 1.2rem 0 1.35rem;
            border-bottom: 1px solid var(--line);
          }

          .feed-item-title {
            margin: 0;
            font-size: 1.1rem;
            line-height: 1.45;
            font-weight: 600;
          }

          .feed-item-title a {
            color: var(--heading);
            text-decoration: none;
          }

          .feed-item-title a:hover {
            color: var(--accent-soft);
            text-decoration: underline;
          }

          .feed-item-meta {
            margin-top: 0.45rem;
            color: var(--meta);
            font-size: 0.9rem;
          }

          .feed-item-description {
            margin: 0.45rem 0 0;
            color: var(--muted);
            font-size: 0.96rem;
          }

          .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            margin-top: 0.65rem;
          }

          .tag {
            display: inline-flex;
            align-items: center;
            padding: 0.08rem 0.58rem;
            border: 1px solid var(--tag-pill-border);
            background: var(--tag-pill-bg);
            color: var(--tag-pill-text);
            border-radius: 999px;
            font-size: 0.82rem;
          }

          .empty {
            margin-top: 2rem;
            color: var(--muted);
          }

          @media (max-width: 767px) {
            html {
              font-size: 16px;
            }

            .page {
              padding: 2.75rem 1rem 4rem;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <span class="eyebrow">RSS Feed</span>
          <h1 class="title"><xsl:value-of select="/rss/channel/title" /></h1>
          <p class="description"><xsl:value-of select="/rss/channel/description" /></p>

          <div class="meta">
            <span>订阅地址：<a href="{/rss/channel/link}rss.xml"><xsl:value-of select="/rss/channel/link" />rss.xml</a></span>
            <span>主页：<a href="{/rss/channel/link}"><xsl:value-of select="/rss/channel/link" /></a></span>
          </div>

          <section class="panel">
            <p>这是供阅读器订阅的 RSS 源。当前页面是方便在浏览器中查看的样式化视图；如需原始 XML，可直接查看页面源码或用阅读器订阅。</p>
          </section>

          <xsl:choose>
            <xsl:when test="count(/rss/channel/item) &gt; 0">
              <ul class="feed-list">
                <xsl:for-each select="/rss/channel/item">
                  <li class="feed-item">
                    <h2 class="feed-item-title">
                      <a href="{link}">
                        <xsl:value-of select="title" />
                      </a>
                    </h2>
                    <div class="feed-item-meta">
                      <span><xsl:value-of select="pubDate" /></span>
                    </div>
                    <xsl:if test="string-length(description) &gt; 0">
                      <p class="feed-item-description">
                        <xsl:value-of select="description" />
                      </p>
                    </xsl:if>
                    <xsl:if test="count(category) &gt; 0">
                      <div class="tag-list">
                        <xsl:for-each select="category">
                          <span class="tag">#<xsl:value-of select="." /></span>
                        </xsl:for-each>
                      </div>
                    </xsl:if>
                  </li>
                </xsl:for-each>
              </ul>
            </xsl:when>
            <xsl:otherwise>
              <p class="empty">当前 RSS feed 里还没有可展示的文章。</p>
            </xsl:otherwise>
          </xsl:choose>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
