# 全局环境事实表

这份文件记录跨项目通用的本机工具路径。项目不在 `E:\data\codex` 下时，也优先参考这里，不要每次问用户 Maven/JDK/Node/Python 在哪里。

## Java / JDK

### JDK 8

- JDK 8 主目录：`E:\tools\java`
- `JAVA_HOME` 默认可用值：`E:\tools\java`
- `javac`: `E:\tools\java\bin\javac.exe`
- 版本：Java 8 / `1.8.0_141`

### JDK 21

- JDK 21 主目录：`C:\Users\gxy\.jdks\ms-21.0.11`

### 使用规则

- 公司旧 Java/Spring 项目默认优先 JDK 8：`E:\tools\java`。
- 明确需要 Java 21、Spring Boot 3、现代 Gradle/Maven 插件或项目指定 21 时，使用 JDK 21：`C:\Users\gxy\.jdks\ms-21.0.11`。
- 当前 PATH 里的 `java` 可能走 `C:\ProgramData\Oracle\Java\javapath\java.exe`，不要只依赖 PATH 判断项目 JDK。

PowerShell 示例：

```powershell
$env:JAVA_HOME='E:\tools\java'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

```powershell
$env:JAVA_HOME='C:\Users\gxy\.jdks\ms-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

## Maven

### Maven 安装

- Maven 主目录：`E:\tools\maven\apache-maven-3.5.4`
- Maven 命令：`E:\tools\maven\apache-maven-3.5.4\bin\mvn.cmd`
- Maven 版本：Apache Maven 3.5.4
- 本地仓库目录：`E:\tools\maven\mavenreposity`

当前 `mvn` 可能不在 PATH 里。需要跑 Maven 时优先使用完整路径。

### 公司内部项目

公司内部项目默认使用：

- Maven：`E:\tools\maven\apache-maven-3.5.4`
- Settings：`E:\tools\maven\settings-hx.xml`
- 本地仓库：`E:\tools\maven\mavenreposity`
- 默认 JDK：通常使用 JDK 8 `E:\tools\java`，除非项目明确要求 JDK 21。

命令示例：

```powershell
$env:JAVA_HOME='E:\tools\java'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
& 'E:\tools\maven\apache-maven-3.5.4\bin\mvn.cmd' -s 'E:\tools\maven\settings-hx.xml' -Dmaven.repo.local='E:\tools\maven\mavenreposity' test
```

### 外部项目

外部项目默认使用：

- Maven：`E:\tools\maven\apache-maven-3.5.4`
- Settings：`E:\tools\maven\settings.xml`
- 本地仓库：`E:\tools\maven\mavenreposity`
- JDK：按项目要求选择 JDK 8 或 JDK 21。

命令示例：

```powershell
& 'E:\tools\maven\apache-maven-3.5.4\bin\mvn.cmd' -s 'E:\tools\maven\settings.xml' -Dmaven.repo.local='E:\tools\maven\mavenreposity' test
```

## Node.js / npm

- Node：`D:\tool\node\node.exe`
- npm：`D:\tool\node\npm.ps1`
- Node 版本：24.14.0.0

## Python

- Python：`D:\技能学习\python.exe`
- Python 版本：3.13.x

注意：路径含中文，PowerShell 一般可用；脚本/工具若有编码问题，优先用 UTF-8 输出。

## Git / ripgrep

- Git：`D:\tool\Git\cmd\git.exe`
- ripgrep：`C:\Users\gxy\AppData\Local\OpenAI\Codex\bin\ada252862d154cdd\rg.exe`

## 使用规则

1. 遇到 Java/Maven/Node/Python/Git 路径问题，先查本文件。
2. 公司内部项目 Maven 默认用 `settings-hx.xml`。
3. 外部项目 Maven 默认用 `settings.xml`。
4. Maven 本地仓库统一用 `E:\tools\maven\mavenreposity`。
5. 不要把这些路径重复写进每个项目，除非项目有特殊版本要求。
6. 如果项目指定了不同 JDK/Maven/Node，以项目自己的 `AGENTS.md` 为准。
7. 如果命令不在 PATH，优先使用本文件记录的完整路径。
