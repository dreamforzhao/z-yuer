# 养育地图 Fullstack 原型

这是“养育地图”0-5 岁育儿百科 App 的本地全栈原型，面向中国大陆家庭，重点覆盖分龄推荐、育儿百科、疫苗儿保、用品安全、睡眠哄睡和学习路径。

## 已实现

- Node 本地 REST API
- 移动端单页 App 页面
- 孩子档案：出生日期、性别、城市
- 自动计算月龄，并生成今日重点
- 育儿百科、内容详情
- 疫苗与儿保时间轴
- 用品与安全库：安全座椅、提篮、尿不湿、餐椅
- 睡眠与哄睡建议
- 学习路径
- 搜索映射：尿不湿、安全座椅、辅食、发烧、哄睡、疫苗

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
- `GET /api/today?birthDate=2025-10-16&sex=男孩&city=上海`
- `GET /api/articles`
- `GET /api/articles/:id`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/care-schedule?birthDate=2025-10-16&city=上海`
- `GET /api/learning-paths`
- `GET /api/search?q=尿不湿`

## 后续开发建议

- 前端迁移到 Vue 3 + TypeScript 或 uni-app + Vue 3。
- 后端迁移到 Spring Boot REST API。
- 数据层接入 MySQL：孩子档案、内容、用品库、疫苗儿保节点、外部链接。
- 增加内容 CMS 和专业审核状态。
- 增加本地城市疫苗/儿保规则配置。
- 增加收藏、阅读历史、提醒和家庭成员协作。
