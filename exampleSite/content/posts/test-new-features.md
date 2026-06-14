---
title: "测试新功能：分页、目录与代码折叠"
date: 2026-06-14
tags: ["test", "hugo", "features"]
description: "用于测试分页、目录生成和代码块折叠功能的综合演示文章。"
---

这篇文章专门用来测试主题最近更新的三个核心功能：自动生成的目录、分页导航，以及可折叠的长代码块。文章包含多层标题结构、不同长度的代码示例，以及足够的正文内容。

## 第一部分：基础配置

在开始之前，我们需要了解一些基本的项目配置。这里展示一个典型的配置文件结构。

### Hugo 配置示例

下面是一个完整的 `hugo.toml` 配置文件：

```toml
baseURL = "https://example.com/"
languageCode = "zh-CN"
title = "我的博客"
theme = "haku"

[params]
  author = "作者名称"
  description = "网站描述"
  
[params.social]
  github = "username"
  twitter = "username"

[markup]
  [markup.highlight]
    style = "monokai"
    lineNos = true
    lineNumbersInTable = true
```

这个配置文件定义了站点的基本信息和主题参数。注意 `[markup.highlight]` 部分控制代码高亮的样式。

### 目录结构

典型的 Hugo 项目目录结构如下：

```
my-site/
├── archetypes/
├── content/
│   ├── posts/
│   ├── about.md
│   └── _index.md
├── data/
├── layouts/
├── static/
├── themes/
└── hugo.toml
```

## 第二部分：功能实现

接下来我们深入探讨每个功能的具体实现细节。

### 目录生成机制

目录（Table of Contents）通过解析文章中的标题层级自动生成。Hugo 提供了内置的 `.TableOfContents` 变量。

#### 基本实现

在模板中调用目录：

```html
{{ if .Params.toc }}
<aside class="toc">
  <h2>目录</h2>
  {{ .TableOfContents }}
</aside>
{{ end }}
```

#### 样式定制

为目录添加样式：

```css
.toc {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
}

.toc ul {
  list-style: none;
  padding-left: 0;
}

.toc ul ul {
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.toc a {
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.toc a:hover {
  color: var(--text-primary);
}
```

### 分页实现

分页功能让长文章可以分成多个页面，改善阅读体验。

#### 配置分页参数

```toml
[params.pagination]
  enabled = true
  perPage = 10
  showAll = false
```

#### 分页模板代码

```go-html-template
{{ $paginator := .Paginate (where .Pages "Type" "posts") }}

<div class="posts">
  {{ range $paginator.Pages }}
    <article>
      <h2><a href="{{ .Permalink }}">{{ .Title }}</a></h2>
      <p>{{ .Summary }}</p>
    </article>
  {{ end }}
</div>

{{ if gt $paginator.TotalPages 1 }}
<nav class="pagination">
  {{ if $paginator.HasPrev }}
    <a href="{{ $paginator.Prev.URL }}">← 上一页</a>
  {{ end }}
  
  <span>第 {{ $paginator.PageNumber }} 页，共 {{ $paginator.TotalPages }} 页</span>
  
  {{ if $paginator.HasNext }}
    <a href="{{ $paginator.Next.URL }}">下一页 →</a>
  {{ end }}
</nav>
{{ end }}
```

### 代码块折叠

长代码块可以折叠起来，避免占据过多屏幕空间。

#### JavaScript 实现

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    const lines = block.textContent.split('\n').length;
    
    // 超过 20 行的代码块添加折叠功能
    if (lines > 20) {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper collapsed';
      
      const toggle = document.createElement('button');
      toggle.className = 'code-toggle';
      toggle.textContent = '展开代码';
      toggle.addEventListener('click', () => {
        wrapper.classList.toggle('collapsed');
        toggle.textContent = wrapper.classList.contains('collapsed') 
          ? '展开代码' 
          : '收起代码';
      });
      
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);
      wrapper.appendChild(toggle);
    }
  });
});
```

#### 配套样式

```css
.code-wrapper {
  position: relative;
  margin: 1.5rem 0;
}

.code-wrapper.collapsed pre {
  max-height: 20rem;
  overflow: hidden;
  position: relative;
}

.code-wrapper.collapsed pre::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background: linear-gradient(transparent, var(--bg-code));
}

.code-toggle {
  display: block;
  margin: 0.5rem auto;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.code-toggle:hover {
  background: var(--bg-hover);
}
```

## 第三部分：测试用例

### 测试场景一：多层嵌套标题

#### 三级标题示例

##### 四级标题示例

###### 五级标题示例

这里测试深层嵌套的标题是否能正确生成目录树形结构。

### 测试场景二：长代码块

下面是一个超长的 Python 脚本，用于测试代码折叠功能：

```python
import os
import sys
import json
import argparse
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Article:
    """文章数据类"""
    title: str
    date: datetime
    tags: List[str]
    content: str
    slug: str
    
    def to_dict(self) -> Dict:
        return {
            'title': self.title,
            'date': self.date.isoformat(),
            'tags': self.tags,
            'content': self.content,
            'slug': self.slug
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Article':
        return cls(
            title=data['title'],
            date=datetime.fromisoformat(data['date']),
            tags=data['tags'],
            content=data['content'],
            slug=data['slug']
        )

class ContentManager:
    """内容管理器"""
    
    def __init__(self, content_dir: Path):
        self.content_dir = content_dir
        self.articles: List[Article] = []
    
    def load_articles(self) -> None:
        """加载所有文章"""
        for md_file in self.content_dir.glob('**/*.md'):
            try:
                article = self._parse_markdown(md_file)
                self.articles.append(article)
            except Exception as e:
                print(f"Error parsing {md_file}: {e}", file=sys.stderr)
    
    def _parse_markdown(self, filepath: Path) -> Article:
        """解析 Markdown 文件"""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 解析前置元数据
        if content.startswith('---'):
            parts = content.split('---', 2)
            frontmatter = parts[1]
            body = parts[2].strip()
        else:
            raise ValueError("No frontmatter found")
        
        # 简单的 YAML 解析
        metadata = {}
        for line in frontmatter.strip().split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                metadata[key.strip()] = value.strip().strip('"')
        
        return Article(
            title=metadata.get('title', ''),
            date=datetime.fromisoformat(metadata.get('date', '')),
            tags=metadata.get('tags', '').split(','),
            content=body,
            slug=filepath.stem
        )
    
    def filter_by_tag(self, tag: str) -> List[Article]:
        """按标签筛选文章"""
        return [a for a in self.articles if tag in a.tags]
    
    def sort_by_date(self, reverse: bool = True) -> List[Article]:
        """按日期排序"""
        return sorted(self.articles, key=lambda a: a.date, reverse=reverse)

def main():
    parser = argparse.ArgumentParser(description='Content management tool')
    parser.add_argument('content_dir', type=Path, help='Content directory')
    parser.add_argument('--tag', help='Filter by tag')
    parser.add_argument('--output', type=Path, help='Output JSON file')
    
    args = parser.parse_args()
    
    manager = ContentManager(args.content_dir)
    manager.load_articles()
    
    articles = manager.sort_by_date()
    if args.tag:
        articles = [a for a in articles if args.tag in a.tags]
    
    if args.output:
        data = [a.to_dict() for a in articles]
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    else:
        for article in articles:
            print(f"{article.date.date()} - {article.title}")

if __name__ == '__main__':
    main()
```

### 测试场景三：内联代码

在正文中使用内联代码如 `const foo = 'bar'` 或 `import { useState } from 'react'`，确保样式正确应用。

## 第四部分：性能优化

### 优化建议

1. **减少 DOM 操作**：批量处理代码块，避免频繁的重排和重绘
2. **懒加载**：只在滚动到可视区域时初始化折叠功能
3. **缓存选择器**：保存常用的 DOM 查询结果
4. **事件委托**：使用事件委托减少事件监听器数量

### 性能测试代码

```javascript
// 性能测试工具
class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
  }
  
  start(label) {
    this.marks.set(label, performance.now());
  }
  
  end(label) {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No mark found for: ${label}`);
      return;
    }
    const duration = performance.now() - start;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    this.marks.delete(label);
  }
}

// 使用示例
const monitor = new PerformanceMonitor();
monitor.start('code-folding');
initCodeFolding();
monitor.end('code-folding');
```

## 总结

这篇测试文章涵盖了：

- ✅ 多层标题结构（测试目录生成）
- ✅ 长代码块（测试折叠功能）
- ✅ 足够的内容长度（测试分页）
- ✅ 不同语言的代码示例
- ✅ 内联代码和列表

通过这些测试场景，可以全面验证主题新功能的表现。
