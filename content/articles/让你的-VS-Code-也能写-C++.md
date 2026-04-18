---
title: 让你的 VS Code 也能写 C++
date: 2025-10-03T14:52:01.124Z
description: ""
tags:
  - Golang
draft: false
slug: "to-let-your-vs-code-support-cpp"
---

现在主流的 C++ IDE 一般是 Visual Studio 和 Dev-C++，但是前者占用高，后者 GUI 太简陋。

所以我们想用最好的文本编辑器 VS Code 来写 C++ 代码。

但是因为 VS Code 没有集成好 C++ 的开发环境，我们必须多走几步。

## 配置 C++ 环境

在 GitHub 仓库 [Releases · niXman/mingw-builds-binaries](https://github.com/niXman/mingw-builds-binaries/releases) 下载 C++ 环境。

选择最底下的 `win32-seh-ucrt`。

![UCRT](https://gcore.jsdelivr.net/gh/karlbaey/tutu@master/picture1/image-20251003221236196.png)

然后把下载好的压缩文件解压到合适的文件夹。我解压在 `E:\Programs\ucrt` 里面。

然后把**二进制目录** `bin` 放到系统环境变量 `Path` 里。我应该放入的配置是 `E:\Programs\ucrt\mingw64\bin`，然后一路按下确定。

> 环境变量直接在 Windows 自带搜索框中搜索即可

这样就配置好了 C++ 的编译器，接着配置 VS Code。

## VS Code 配置

下载两个插件。按下 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> 打开插件市场。

![Code Runner](https://gcore.jsdelivr.net/gh/karlbaey/tutu@master/picture1/image-20251003220525756.png)![C++](https://gcore.jsdelivr.net/gh/karlbaey/tutu@master/picture1/image-20251003220443788.png)

然后按下 <kbd>F1</kbd> 搜索 `Preferences: Open User Settings`，搜索 `Code-runner`，把 `Run In Terminal` 打开。

![Run In Terminal](https://gcore.jsdelivr.net/gh/karlbaey/tutu@master/picture1/image-20251003222730205.png)

> 这样做的原因是，Code Runner 自带的终端是**只读的终端**，如果需要写 ACM 输入输出那就什么都干不了，所以我们要换成 VS Code 内嵌终端。

接着继续按下 <kbd>F1</kbd> 搜索 `Preferences: Open User Settings (JSON)`。<kbd>Ctrl</kbd>+<kbd>F</kbd> 搜索 `code-runner.executorMap`，如下面所示修改。

```json {title="settings.json"}
{
  "code-runner.executorMap": {
        // 其余省略
        //其他地方不要动！
        "c": "cd $dir && gcc -fexec-charset=GBK $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
        "cpp": "cd /d $dir && g++ -fexec-charset=GBK $fileName -o $fileNameWithoutExt && .\\$fileNameWithoutExt.exe",
  }
}
```

然后写一个 `hello.cpp` 测试一下。

```cpp {title="hello.cpp"}
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

按下 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>，如果不出意外，那就会在终端中输出 `Hello, World!` 了。

## 一些额外的东西

其实 Code Runner 的配置也可以为 Golang 修改。

```json
{
  "go": "cd /d $dir && go build $fileName && .\\$fileNameWithoutExt.exe"
}
```

这样在 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> 启动 Code Runner 后，它就会自动编译好 Golang 代码并且执行了。

⚠️**注意**：配置中使用到了 `cd` 命令。

```cmd
cd /d E:\xxxx
```

注意这里的 `/d` 参数是必要的，它能同时切换盘符（从 C 盘切换到 E 盘）和进入目录，如果不加 `/d` 就会导致什么都没有发生。

**_(The end)_**

🎉
