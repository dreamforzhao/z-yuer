# 养育地图 z-yuer

面向中国大陆 0-5 岁家庭的育儿百科 App 产品设计与本地全栈原型。

## 目录

- `parenting-map-prototype/`：产品方案、墨刀线框稿、静态 HTML 原型。
- `parenting-map-fullstack/`：可运行的本地全栈原型，包含 Node REST API 和移动端单页 App。

## 当前能力

- 孩子档案：出生日期、性别、城市。
- 自动计算月龄。
- 首页以孩子信息为中心：月龄、城市、喂养方式、出生体重/体长、本次儿保体重/身长。
- 按孩子档案生成个性化建议。
- 育儿百科、内容详情。
- 疫苗与儿保时间轴。
- 百科分层：喂养、健康、睡眠、发育、行为、用品安全、入园、父母支持。
- 用品与安全、睡眠哄睡收进百科，不再作为底部主栏目。
- 搜索映射：尿不湿、安全座椅、辅食、发烧、哄睡、疫苗。

## 运行全栈原型

```bash
cd parenting-map-fullstack
node server.js
```

打开：

```text
http://localhost:4173
```

## 产品设计稿

重点文件：

- `parenting-map-prototype/modao-wireframe-spec.md`
- `parenting-map-prototype/modao-product-handoff.md`
- `parenting-map-prototype/README.md`

这些文件用于墨刀、即时设计、Figma 或后续开发交付。
