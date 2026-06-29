# 养育地图 Fullstack 原型

这是“养育地图”0-5 岁育儿知识学习 App 的本地全栈原型。产品核心从提示型百科升级为知识学习系统：用课程、判断框架、案例、误区和来源，帮助家长建立健康与喂养判断力。

## 已实现

- Node 本地 REST API
- 移动端单页 App 页面
- 孩子档案：孩子名字、出生日期、性别、喂养方式
- 自动计算月龄，并推荐今日学习课程
- 出生体重/体长、本次儿保体重/身长记录
- 喂养方式：母乳、奶粉、混合喂养
- 知识库、课程轨道、深度学习详情
- 疫苗与儿保时间轴
- 知识分栏：喂养、健康、睡眠、用品、行为
- 知识轨道：健康判断课、喂养基础课、睡眠与行为课
- 判断入口：发热先判断、辅食准备度、疫苗儿保、夜醒排查

## 运行

```bash
node server.js
```

默认地址：

```text
http://localhost:4173
```

## API

- `GET /api/health`
- `GET /api/children/demo`
- `GET /api/home?nickname=昕昕&birthDate=2025-10-16&sex=男孩&feedingType=混合喂养`
- `GET /api/knowledge`
- `GET /api/encyclopedia`
- `GET /api/articles`
- `GET /api/articles/:id`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/care-schedule?birthDate=2025-10-16&city=上海`
- `GET /api/growth-records?birthDate=2025-10-16&birthWeightKg=3.25&birthLengthCm=50&currentWeightKg=8.4&currentHeightCm=70.5`
- `GET /api/search?q=尿不湿`

## 后续开发建议

- 前端迁移到 Vue 3 + TypeScript 或 uni-app + Vue 3。
- 后端迁移到 Spring Boot REST API。
- 数据层接入 MySQL：孩子档案、内容、用品库、疫苗儿保节点、外部链接。
- 增加内容 CMS、来源标注、专家审核状态和版本管理。
- 增加本地疫苗/儿保规则配置。
- 增加收藏、阅读历史、提醒和家庭成员协作。

## APK 打包

项目内置了一个轻量 Android WebView 包装工程，目录为 `android-app/`。APK 会加载 `public/` 中的静态页面，并在没有本地 Node API 时自动使用 `offline-data.js` 的内置数据，因此可以作为离线演示版运行。

环境要求：

- JDK：建议使用 `global-env.md` 中的 JDK 21：`C:\Users\gxy\.jdks\ms-21.0.11`。当前工程使用 Android Gradle Plugin 8.5.2，需要现代 JDK。
- Android SDK：安装 Android Studio 或命令行 SDK，并设置 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`。
- Gradle：安装 Gradle，或在 `android-app/` 下生成 `gradlew.bat`。

打包命令：

```powershell
cd parenting-map-fullstack
$env:JAVA_HOME='C:\Users\gxy\.jdks\ms-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\scripts\build-apk.ps1
```

Debug APK 输出位置：

```text
parenting-map-fullstack/android-app/app/build/outputs/apk/debug/app-debug.apk
```

如果提示未找到 Android SDK，先安装 Android Studio，并在 SDK Manager 中安装 Android SDK Platform 35 和 Build-Tools。

## 本地访问排查

推荐直接用脚本启动，避免不同 shell 里的 `node` 路径不一致：

```powershell
cd parenting-map-fullstack
.\scripts\start-local.ps1
```

然后访问：`http://localhost:4173/`。
