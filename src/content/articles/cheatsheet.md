---
title: "Cheatsheet"
published: 2025-11-23
tags:
  - "Markdown"
  - "帮助"
permalink: "cheatsheet"
description: "这里有一些可以在 Haku 博客主题使用的语法。"
---

## 1. 标题

# 一级标题 (H1)

## 二级标题 (H2)

### 三级标题 (H3)

#### 四级标题 (H4)

##### 五级标题 (H5)

###### 六级标题 (H6)

---

## 2. 文本样式

_这是斜体文本_
_这也是斜体文本_

**这是粗体文本**
**这也是粗体文本**

**_这是粗斜体文本_**
**_这也是粗斜体文本_**

~~这是带删除线的文本~~

这是一个 `行内代码` 的例子。

> 这是一个块引用。
>
> > 这是一个嵌套的块引用。

---

## 3. 列表

### 无序列表

- 列表项 A
- 列表项 B
  - 嵌套列表项 B1
  - 嵌套列表项 B2
- 列表项 C

### 有序列表

1.  第一项
2.  第二项
    1.  嵌套第一项
    2.  嵌套第二项
3.  第三项

### 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 待办事项

---

## 4. 代码块

这是一个行内代码块：`console.log('Hello, World!');`

代码块的顶端会展示文件名，右上角会展示语言。文件名是可选的，在书写代码块时，在语言右侧空一格加入 `title` 标记即可。

注意如果不写文件名，那么代码语言也不会显示。

````markdown
```python title="hello.py"
import antigravity

def greet(name):
    """这是一个向世界问好的函数"""
    print(f"Hello, {name}!")

if __name__ == "__main__":
    greet("Markdown")
```
````

效果如下，这是一个带有语法高亮的 Python 代码块：

```python title="hello.py"
import antigravity

def greet(name):
    """这是一个向世界问好的函数"""
    print(f"Hello, {name}!")

if __name__ == "__main__":
    greet("Markdown")
```

这是一个没有指定语言的普通代码块：

```text title="plain.txt"
npm install
npm run dev
```

---

## 5. 链接与图片

### 链接

这是一个指向 [OpenAI](https://www.openai.com) 的链接。

### 图片

![这是一个示例图片](/favicon.png "图片悬停标题")

---

## 6. 表格

| 对齐方式 | 左对齐 | 居中对齐 | 右对齐 |
| :------- | :----- | :------: | -----: |
| **内容** | Cell 1 |  Cell 2  | Cell 3 |
| **示例** | a      |    b     |      c |
| **数据** | 123    |   456    |    789 |

---

## 7. 脚注

这是一个需要脚注的句子[^1]。这是另一个需要脚注的地方[^footnote2]。

## 8. 数学公式 （KaTeX）

Haku 支持 LaTeX 语法的数学公式以及化学公式渲染。

### 行内公式

质能方程是 $ E=mc^2 $。当 $ a \ne 0 $ 时，二次方程 $ ax^2 + bx + c = 0 $ 的解为 $ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $。

```latex title="Mass_Energy_Equivalent_Formula_(Einstein).tex"
质能方程是 $ E=mc^2 $。当 $ a \ne 0 $ 时，二次方程 $ ax^2 + bx + c = 0 $ 的解为 $ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $。
```

### 块级公式

麦克斯韦方程组 (积分形式):

$$

\oint_S \mathbf{D} \cdot d\mathbf{a} = Q_{in} \\
\oint_S \mathbf{B} \cdot d\mathbf{a} = 0 \\
\oint_C \mathbf{E} \cdot d\mathbf{l} = - \frac{d\Phi_B}{dt} \\
\oint_C \mathbf{H} \cdot d\mathbf{l} = I_{in} + \frac{d\Phi_D}{dt}


$$

```latex title="Maxwell.tex"
$$

\oint_S \mathbf{D} \cdot d\mathbf{a} = Q_{in} \\
\oint_S \mathbf{B} \cdot d\mathbf{a} = 0 \\
\oint_C \mathbf{E} \cdot d\mathbf{l} = - \frac{d\Phi_B}{dt} \\
\oint_C \mathbf{H} \cdot d\mathbf{l} = I_{in} + \frac{d\Phi_D}{dt}

$$
```

---

## 9. Mermaid 图表渲染

Haku 支持多种 mermaid 图表。

### 流程图

这是一个极为复杂的流程图。

````markdown title="services.md"
```mermaid
graph TB
    subgraph ClientLayer [客户端层]
        direction TB
        Web[Web 浏览器] --> |HTTPS/443| LB[负载均衡器]
        App[移动端 App] --> |API/443| LB
    end

    subgraph ClusterLayer [K8s 集群]
        LB --> Ingress[Ingress Gateway]

        subgraph Services [核心服务网格]
            direction LR
            Auth[认证服务]
            User[用户中心]
            Order[订单系统]
            Pay[支付网关]

            Ingress --> Auth
            Auth --> User
            Ingress --> Order
            Order --> Pay
            Order --> User
            Pay --> Wechat[微信支付]
            Pay --> AliPay[支付宝]
        end

        subgraph DataLayer [数据持久层]
            Redis[(Redis 缓存)]
            MySQL[(MySQL 主从)]
            ES{ElasticSearch}

            User --> MySQL
            Order --> MySQL
            Order --> Redis
            Services --> ES
        end

        subgraph MessageQueue [消息中间件]
            Kafka{{Apache Kafka}}
            Pay -.-> |支付成功事件| Kafka
            Kafka -.-> |消费| Order
            Kafka -.-> |消费| User
        end
    end

    style ClientLayer fill:#f9f,stroke:#333
    style Services fill:#e1f5fe,stroke:#0277bd
    style DataLayer fill:#fff3e0,stroke:#ff6f00
```
````

```mermaid
graph TB
    subgraph ClientLayer [客户端层]
        direction TB
        Web[Web 浏览器] --> |HTTPS/443| LB[负载均衡器]
        App[移动端 App] --> |API/443| LB
    end

    subgraph ClusterLayer [K8s 集群]
        LB --> Ingress[Ingress Gateway]

        subgraph Services [核心服务网格]
            direction LR
            Auth[认证服务]
            User[用户中心]
            Order[订单系统]
            Pay[支付网关]

            Ingress --> Auth
            Auth --> User
            Ingress --> Order
            Order --> Pay
            Order --> User
            Pay --> Wechat[微信支付]
            Pay --> AliPay[支付宝]
        end

        subgraph DataLayer [数据持久层]
            Redis[(Redis 缓存)]
            MySQL[(MySQL 主从)]
            ES{ElasticSearch}

            User --> MySQL
            Order --> MySQL
            Order --> Redis
            Services --> ES
        end

        subgraph MessageQueue [消息中间件]
            Kafka{{Apache Kafka}}
            Pay -.-> |支付成功事件| Kafka
            Kafka -.-> |消费| Order
            Kafka -.-> |消费| User
        end
    end

    style ClientLayer fill:#f9f,stroke:#333
    style Services fill:#e1f5fe,stroke:#0277bd
    style DataLayer fill:#fff3e0,stroke:#ff6f00
```

### 序列图

````markdown title="greetings.md"
```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```
````

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```

### 饼图

````markdown title="code_langs.md"
```mermaid
pie
    title 编程语言分布
    "JavaScript" : 45
    "Python" : 25
    "Java" : 15
    "C++" : 10
    "Other" : 5
```
````

```mermaid
pie
    title 编程语言分布
    "JavaScript" : 45
    "Python" : 25
    "Java" : 15
    "C++" : 10
    "Other" : 5
```

### 甘特图

````markdown title="saas_route.md"
```mermaid
gantt
    title 2024年 SaaS 平台研发路线图
    dateFormat  YYYY-MM-DD
    axisFormat  %m-%d
    excludes weekends

    section 需求阶段
    市场调研       :done,    des1, 2024-01-01, 2024-01-10
    需求评审       :active,  des2, 2024-01-11, 5d
    UI/UX 原型设计 :         des3, after des2, 7d

    section 核心开发 (后端)
    数据库架构设计 :crit,    back1, after des3, 5d
    用户认证模块   :         back2, after back1, 7d
    支付接口对接   :         back3, after back2, 10d
    API 压力测试   :         back4, 2024-02-15, 5d

    section 前端开发 (Web & Mobile)
    环境搭建       :         front1, after des3, 3d
    组件库开发     :         front2, after front1, 10d
    管理后台开发   :         front3, after back2, 12d
    落地页开发     :         front4, after front3, 5d

    section 部署与运维
    CI/CD 流程配置 :active,  ops1, 2024-01-20, 7d
    Docker 容器化  :         ops2, after ops1, 5d
    灰度发布       :milestone, 2024-03-01, 0d
    正式上线       :crit, 2024-03-10, 0d
```
````

```mermaid
gantt
    title 2024年 SaaS 平台研发路线图
    dateFormat  YYYY-MM-DD
    axisFormat  %m-%d
    excludes weekends

    section 需求阶段
    市场调研       :done,    des1, 2024-01-01, 2024-01-10
    需求评审       :active,  des2, 2024-01-11, 5d
    UI/UX 原型设计 :         des3, after des2, 7d

    section 核心开发 (后端)
    数据库架构设计 :crit,    back1, after des3, 5d
    用户认证模块   :         back2, after back1, 7d
    支付接口对接   :         back3, after back2, 10d
    API 压力测试   :         back4, 2024-02-15, 5d

    section 前端开发 (Web & Mobile)
    环境搭建       :         front1, after des3, 3d
    组件库开发     :         front2, after front1, 10d
    管理后台开发   :         front3, after back2, 12d
    落地页开发     :         front4, after front3, 5d

    section 部署与运维
    CI/CD 流程配置 :active,  ops1, 2024-01-20, 7d
    Docker 容器化  :         ops2, after ops1, 5d
    灰度发布       :milestone, 2024-03-01, 0d
    正式上线       :crit, 2024-03-10, 0d
```

---

## 10. 提示/警告块

这种语法在 GitHub、Docsify 和许多文档生成器中很流行。

```markdown title="notifications.md"
> [!NOTE]
> 这是一个提示（Note）。用于引起注意的普通信息。

> [!TIP]
> 这是一个技巧（Tip）。用于提供有用的建议或快捷方式。

> [!IMPORTANT]
> 这是重要信息（Important）。需要用户特别关注的内容。

> [!WARNING]
> 这是一个警告（Warning）。用于提示潜在的风险或需要谨慎操作的地方。

> [!CAUTION]
> 这是一个危险警告（Caution）。表示执行此操作可能会导致严重后果。

:::note[自定义标题]
这是一个自定义标题的提示块。
:::
```

> [!NOTE]
> 这是一个提示（Note）。用于引起注意的普通信息。

> [!TIP]
> 这是一个技巧（Tip）。用于提供有用的建议或快捷方式。

> [!IMPORTANT]
> 这是重要信息（Important）。需要用户特别关注的内容。

> [!WARNING]
> 这是一个警告（Warning）。用于提示潜在的风险或需要谨慎操作的地方。

> [!CAUTION]
> 这是一个危险警告（Caution）。表示执行此操作可能会导致严重后果。

:::note[自定义标题]
这是一个自定义标题的提示块。
:::

---

## 11. 嵌入 HTML

Haku 可在 Markdown 中直接嵌入 HTML 代码。

### 可折叠内容

使用 `:::fold[title] ... :::` 来创建一个可折叠的内容区域。

:::fold[点击展开查看详细信息]
这里是隐藏的详细内容。可以包含段落、列表、甚至是图片。
:::

```markdown title="collapsible_block.md"
:::fold[点击展开查看详细信息]
这里是隐藏的详细内容。可以包含段落、列表、甚至是图片。
:::
```

### 文本样式

使用 HTML 标签来改变文本颜色：这段文字应该是 <span style="color: #007bff;">蓝色</span> 的，而这段是 <span style="color: #dc3545;">红色</span> 的。

```html title="change_colors.html"
使用 HTML 标签来改变文本颜色：这段文字应该是
<span style="color: #007bff;">蓝色</span> 的，而这段是
<span style="color: #dc3545;">红色</span> 的。
```

[^1]: 这是第一个脚注的解释文本。

[^footnote2]: 这是第二个脚注的详细内容，可以很长。
