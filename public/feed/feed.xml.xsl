<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="utf-8" indent="yes" />

  <!-- 匹配 RSS 根节点 -->
  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <title><xsl:value-of select="rss/channel/title" /> - RSS 源</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png"></link>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          }

          body {
          background-color: #0a0c0f; /* 深邃黑底 */
          color: #d1d5db; /* 柔和灰白文字 */
          font-family: 'SN Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
          Arial, sans-serif;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          }

          /* 超链接默认风格 (干净、无彩色) */
          a {
          color: #c0c6d0;
          text-decoration: none;
          transition: color 0.2s ease, border-color 0.2s ease;
          }
          a:hover {
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: #6b7280;
          }

          /* 容器 — 居中、留白呼吸 */
          .feed-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          }

          /* 频道头部 + 分隔线 */
          .channel-header {
          margin-bottom: 3rem;
          border-bottom: 1px solid #2a2e33;
          padding-bottom: 2rem;
          }

          .channel-header h1 {
          font-size: 2.8rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
          color: #ffffff; /* 纯白标题 */
          }

          .channel-desc {
          font-size: 1.125rem;
          color: #b0b7c4; /* 中灰 */
          margin-bottom: 1rem;
          }

          .channel-header p {
          margin: 1rem 0;
          color: #9aa3b4; /* 较淡灰 */
          }

          /* 按钮基础 — 硬朗边框、透明背景、悬停填充 */
          .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border: 1px solid #3f444e;
          border-radius: 8px;
          background-color: transparent;
          color: #e5e9f0;
          text-decoration: none !important; /* 强制移除下划线 */
          font-weight: 500;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
          cursor: pointer;
          margin-right: 1rem;
          margin-bottom: 0.5rem;
          }

          .btn:hover {
          background-color: #262b33; /* 悬停深色填充 */
          border-color: #5f6a7a;
          color: #ffffff;
          }

          .btn-primary {
          border-color: #6b7a8f; /* 稍亮边框，略强调 */
          color: #ffffff;
          }

          .btn-primary:hover {
          background-color: #2e3640;
          }

          .btn-secondary {
          border-color: #3f444e;
          color: #d1d5db;
          }

          /* 文章卡片 — 极简分层、微光晕 */
          .article-card {
          background-color: #111417; /* 比背景稍亮 */
          border: 1px solid #2a2e33;
          border-radius: 14px;
          padding: 2rem;
          margin-bottom: 2rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          }

          .article-card:hover {
          border-color: #4b5563; /* 悬停边框提亮 */
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
          }

          /* 文章标题 — 清晰有力 */
          .article-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.9rem;
          font-weight: 600;
          line-height: 1.3;
          }

          .article-title a {
          color: #ffffff;
          text-decoration: none;
          }

          .article-title a:hover {
          text-decoration: underline;
          text-underline-offset: 5px;
          text-decoration-color: #888;
          }

          /* 日期元数据 — 等宽字体强化技术感 */
          .article-meta {
          font-size: 0.9rem;
          color: #8b949e;
          margin-bottom: 1.25rem;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
          letter-spacing: 0.02em;
          }

          /* 文章摘要 — 可读性好，内部图片适配 */
          .article-description {
          color: #ccd2da;
          margin-bottom: 1.5rem;
          }

          .article-description img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          border: 1px solid #2e3338;
          margin: 1rem 0;
          }

          .article-description p {
          margin: 1rem 0;
          }

          .article-description a {
          color: #cccccc;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: #5f6a7a;
          }

          .article-description a:hover {
          color: #ffffff;
          text-decoration-color: #cccccc;
          }

          /* 阅读全文按钮右对齐 */
          .read-more {
          text-align: right;
          }

          /* 页脚 — 低调、包含链接 */
          .footer {
          margin-top: 3rem;
          border-top: 1px solid #2a2e33;
          padding-top: 2rem;
          text-align: center;
          color: #8b949e;
          font-size: 0.95rem;
          }

          .footer a {
          color: #c9d1d9;
          text-decoration: none;
          border-bottom: 1px dotted #4b5563;
          }

          .footer a:hover {
          color: #ffffff;
          border-bottom-color: #cccccc;
          }

          /* 响应式：移动端紧凑、全宽按钮 */
          @media (max-width: 640px) {
          .feed-container {
          padding: 1rem;
          }

          .channel-header h1 {
          font-size: 2.2rem;
          }

          .article-card {
          padding: 1.5rem;
          }

          .article-title {
          font-size: 1.6rem;
          }

          .btn {
          display: block;
          width: 100%;
          margin-right: 0;
          text-align: center;
          }
          }
        </style>
        <link rel="preconnect" href="https://fonts.loli.net" />
        <link rel="preconnect" href="https://fonts.loli.net" crossorigin="anonymous" />
        <link
          href="https://fonts.loli.net/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&amp;display=swap"
          rel="stylesheet" />
      </head>
      <body>
        <div class="feed-container">

          <!-- 频道信息 -->
          <div class="channel-header">
            <h1>
              <xsl:value-of select="rss/channel/title" />
            </h1>
            <div class="channel-desc">
              <xsl:value-of select="rss/channel/description" />
            </div>
            <p><a href="https://github.com/Karlbaey/Haku">Haku</a> is a static blog
              theme based on the Astro framework. It focuses on presenting blogs in a minimalist
              style and enhancing the reader's experience. Haku showcases personal projects and
              notes, and also provides an excellent platform for people who like to document their
              lives. </p>

            <p>Haku uses Tailwind CSS as its CSS engine and features many responsive design
              elements, supports light and dark theme switching, and site-wide search based on
              Pagefind. Haku is responsive and has a clean style. </p>

            <p>Designed by <a href="https://github.com/Karlbaey">@Karlbaey</a>,
              based on the <a href="https://astro.build">Astro</a> front-end framework. </p>
            <!-- 访问网站按钮（主要行动点） -->
            <a href="{rss/channel/link}" class="btn btn-primary">Visit Website →</a>
          </div>

          <!-- 文章列表 -->
          <xsl:for-each select="rss/channel/item">
            <div class="article-card">
              <h2 class="article-title">
                <a href="{link}">
                  <xsl:value-of select="title" />
                </a>
              </h2>
              <div class="article-meta"> 📅 <xsl:call-template name="formatDate">
                  <xsl:with-param name="date" select="pubDate" />
                </xsl:call-template>
              </div>
              <div class="article-description">
                <xsl:value-of select="description" disable-output-escaping="yes" />
              </div>
              <div class="read-more">
                <a href="{link}" class="btn btn-secondary">Read more →</a>
              </div>
            </div>
          </xsl:for-each>

          <!-- 页脚 -->
          <div class="footer">
            <xsl:value-of select="rss/channel/copyright" />
            <xsl:if test="rss/channel/lastBuildDate">
              <br />Updated <xsl:call-template name="formatDate">
                <xsl:with-param name="date" select="rss/channel/lastBuildDate" />
              </xsl:call-template>
            </xsl:if>
            <br />
            <p>This is a RSS Feed generated by <a
                href="https://github.com/Karlbaey/Haku">Haku</a>. RSS readers can use
              the URL in the address bar.</p>
          </div>

        </div>
      </body>
    </html>
  </xsl:template>

  <!-- 日期格式化模板（可自由替换为你喜欢的格式） -->
  <xsl:template name="formatDate">
    <xsl:param name="date" />
    <xsl:variable name="dateStr" select="string($date)" />
    <xsl:variable name="day" select="substring($dateStr, 6, 2)" />
    <xsl:variable name="monthAbbr" select="substring($dateStr, 9, 3)" />
    <xsl:variable name="year" select="substring($dateStr, 13, 4)" />

    <xsl:variable name="dayNum" select="number($day)" />
    <xsl:variable name="suffix">
      <xsl:choose>
        <xsl:when test="$dayNum = 1 or $dayNum = 21 or $dayNum = 31">st</xsl:when>
        <xsl:when test="$dayNum = 2 or $dayNum = 22">nd</xsl:when>
        <xsl:when test="$dayNum = 3 or $dayNum = 23">rd</xsl:when>
        <xsl:otherwise>th</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:value-of select="concat($dayNum, $suffix, ' ', $monthAbbr, ' ', $year)" />
  </xsl:template>

</xsl:stylesheet>