export const childProfile = {
  id: "demo",
  nickname: "昕昕",
  birthDate: "2025-10-16",
  sex: "男孩",
  city: "上海",
  feedingType: "混合喂养",
  allergies: ["暂无"],
  caregivers: ["妈妈", "爸爸", "外婆"]
};

export const stageRecommendations = [
  {
    maxMonth: 6,
    stage: "0-6个月",
    today: [
      { topic: "喂养", text: "稳定母乳/配方奶节奏，观察尿量、体重和精神状态。" },
      { topic: "睡眠", text: "仰卧、硬床面，床上不放松软物。" },
      { topic: "出行", text: "提篮或反向安全座椅提前安装并复查固定。" }
    ],
    sleep: ["先保证安全睡眠环境。", "睡前流程短而稳定。", "哭闹先排查饥饿、尿布、胀气、冷热和不适。"],
    cards: ["母乳和奶量判断", "新生儿护理清单", "提篮怎么用"]
  },
  {
    maxMonth: 12,
    stage: "7-12个月",
    today: [
      { topic: "辅食", text: "练习手指食物，观察吞咽能力和过敏反应。" },
      { topic: "发育", text: "鼓励爬行、坐稳和精细动作，不强迫站立。" },
      { topic: "安全", text: "检查餐椅、安全插座、床边高度和小物件误吞风险。" }
    ],
    sleep: ["固定入睡时间和睡前流程。", "夜醒时降低互动强度。", "分离焦虑期增加白天陪伴和睡前安抚。"],
    cards: ["辅食从泥糊到手指食物", "8个月体检和疫苗提醒", "尿不湿尺码和红屁屁"]
  },
  {
    maxMonth: 24,
    stage: "1-2岁",
    today: [
      { topic: "吃饭", text: "建立餐椅进食规则，减少追喂和边玩边吃。" },
      { topic: "语言", text: "多用短句回应孩子意图，少用考试式提问。" },
      { topic: "出行", text: "继续使用适龄安全座椅，确认肩带高度。" }
    ],
    sleep: ["保留午睡，避免太晚。", "睡前边界保持一致。", "夜醒时复盘白天小睡、晚餐、出牙和分离焦虑。"],
    cards: ["挑食和自主进食", "走路后的家居安全", "尿不湿到拉拉裤"]
  },
  {
    maxMonth: 36,
    stage: "2-3岁",
    today: [
      { topic: "行为", text: "发脾气时先命名情绪，再给两个可选方案。" },
      { topic: "如厕", text: "观察准备信号，不把如厕训练变成惩罚。" },
      { topic: "阅读", text: "每天 10-15 分钟亲子阅读，重在互动。" }
    ],
    sleep: ["睡前边界要少而清楚。", "怕黑时先共情，再用固定流程回到床上。", "不要用恐吓或关门惩罚入睡。"],
    cards: ["两岁总说不", "如厕训练", "绘本和表达"]
  },
  {
    maxMonth: 72,
    stage: "3-5岁",
    today: [
      { topic: "入园", text: "练习表达需求、独立如厕、午睡和分离告别。" },
      { topic: "规则", text: "用家庭规则卡替代反复说教。" },
      { topic: "安全", text: "强化过马路、乘车、陌生人和家中电器安全。" }
    ],
    sleep: ["睡前避免长视频和高兴奋游戏。", "固定阅读和关灯时间。", "持续打鼾、憋醒或白天嗜睡需要咨询医生。"],
    cards: ["入园准备清单", "情绪和规则", "儿童座椅升级"]
  }
];

export const articles = [
  {
    id: "food-8m",
    title: "8个月不爱吃辅食怎么办",
    topic: "喂养营养",
    ageRange: "6-12个月",
    summary: ["辅食初期目标是练习，不是立刻吃很多。", "连续拒绝不代表不喜欢，可隔几天换形态再试。", "不要追喂、强迫、用零食交换。"],
    steps: ["餐前 2 小时避免大量奶和零食。", "每次只上 1-2 种食物，分量从一两勺开始。", "同一种食物观察 2-3 天，再增加新食材。"],
    risks: ["体重下降", "反复呕吐", "吞咽困难", "明显过敏反应"],
    resources: [
      { title: "WHO 婴幼儿喂养建议", url: "https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding" },
      { title: "崔玉涛辅食相关视频搜索", url: "https://www.bilibili.com/search?keyword=%E5%B4%94%E7%8E%89%E6%B6%9B%20%E8%BE%85%E9%A3%9F" }
    ]
  },
  {
    id: "fever-home",
    title: "孩子发热时先判断什么",
    topic: "健康护理",
    ageRange: "0-5岁",
    summary: ["体温只是一个指标，精神状态、呼吸、饮水和尿量同样重要。", "小月龄、抽搐、呼吸困难、精神差需要尽快就医。", "不要叠加使用退热药。"],
    steps: ["记录体温和时间。", "观察精神状态、呼吸、尿量和皮疹。", "按医生建议或药品说明使用退热药。"],
    risks: ["3月龄以下发热", "抽搐", "呼吸困难", "明显脱水", "精神反应差"],
    resources: []
  },
  {
    id: "tantrum-2y",
    title: "2岁孩子总说“不”怎么回应",
    topic: "行为情绪",
    ageRange: "2-3岁",
    summary: ["先承认孩子想自己做的愿望。", "给有限选择，不开放式争论。", "家长先稳定语气，比讲大道理更重要。"],
    steps: ["说出情绪：你很想自己来。", "给选择：你想先穿鞋还是先拿水杯？", "守住底线：不能打人，可以跺脚或抱抱。"],
    risks: ["持续攻击行为", "明显语言倒退", "家庭照护人反应严重不一致"],
    resources: []
  }
];

export const products = [
  {
    id: "car-seat",
    title: "儿童安全座椅/提篮",
    category: "出行安全",
    necessity: "必要",
    ageRange: "出生-12岁按身高体重分段",
    selectionCriteria: ["看适用身高体重", "确认车内固定方式", "优先阅读说明书", "小月龄重点看反向安装"],
    usageSteps: ["安装后晃动不应明显松动。", "肩带高度贴合孩子肩部。", "冬天避免厚外套影响安全带贴合。"],
    commonMistakes: ["抱着坐车", "过早正向安装", "肩带过松", "使用来源不明的二手座椅"],
    videoLinks: [{ title: "安全座椅安装视频搜索", url: "https://www.bilibili.com/search?keyword=%E5%84%BF%E7%AB%A5%E5%AE%89%E5%85%A8%E5%BA%A7%E6%A4%85%20%E5%AE%89%E8%A3%85" }]
  },
  {
    id: "diaper",
    title: "尿不湿/拉拉裤",
    category: "日常护理",
    necessity: "必要",
    ageRange: "出生-如厕训练完成",
    selectionCriteria: ["按体重选尺码", "看腰围和腿围勒痕", "红屁屁时关注透气和更换频率", "夜用看吸收和反渗"],
    usageSteps: ["白天及时更换。", "清洁后等皮肤干爽再穿。", "红屁屁时减少湿巾摩擦。"],
    commonMistakes: ["尺码过小", "长时间不换", "只按品牌不看孩子皮肤反馈"],
    videoLinks: [{ title: "尿不湿怎么选视频搜索", url: "https://www.bilibili.com/search?keyword=%E5%B0%BF%E4%B8%8D%E6%B9%BF%20%E6%80%8E%E4%B9%88%E9%80%89" }]
  },
  {
    id: "high-chair",
    title: "餐椅、餐具、围兜",
    category: "喂养用品",
    necessity: "建议",
    ageRange: "能坐稳后",
    selectionCriteria: ["餐椅稳定性", "五点式或可靠束缚", "易清洁", "餐具边缘和材质"],
    usageSteps: ["每次进食坐餐椅。", "系好安全带。", "餐椅旁不放可攀爬物。"],
    commonMistakes: ["孩子站在餐椅上", "边走边喂", "用餐具当玩具敲击硬物"],
    videoLinks: [{ title: "宝宝餐椅怎么选视频搜索", url: "https://www.bilibili.com/search?keyword=%E5%AE%9D%E5%AE%9D%E9%A4%90%E6%A4%85%20%E6%80%8E%E4%B9%88%E9%80%89" }]
  }
];

export const careSchedule = [
  { ageMonth: 0, label: "出生", type: "vaccine", title: "乙肝疫苗第1剂、卡介苗", description: "建立儿童保健册，记录出生信息。" },
  { ageMonth: 1, label: "1月龄", type: "vaccine", title: "乙肝疫苗第2剂", description: "同步关注黄疸、体重增长和喂养。" },
  { ageMonth: 3, label: "2-4月龄", type: "vaccine", title: "脊灰、百白破等节点", description: "以当地接种门诊预约安排为准。" },
  { ageMonth: 6, label: "6月龄", type: "vaccine", title: "乙肝疫苗第3剂、A群流脑等节点", description: "可同步评估辅食准备和贫血风险。" },
  { ageMonth: 8, label: "8月龄", type: "vaccine", title: "麻腮风/麻疹类、乙脑等节点", description: "部分地区安排略有差异，接种前确认。" },
  { ageMonth: 12, label: "12月龄", type: "health", title: "1岁儿保评估", description: "身高体重、牙齿、语言理解、站立行走准备。" },
  { ageMonth: 18, label: "18月龄", type: "health", title: "加强免疫与儿保评估", description: "关注语言、行为、营养和安全。" },
  { ageMonth: 36, label: "3岁", type: "health", title: "入园前健康管理", description: "视力、口腔、行为、作息和疫苗查验。" }
];

export const learningPaths = [
  {
    id: "sleep",
    title: "睡眠和哄睡",
    ageRange: "0-5岁",
    lessons: ["安全睡眠", "睡前流程", "夜醒处理", "抱睡转床", "需要就医的睡眠信号"]
  },
  {
    id: "feeding",
    title: "从母乳到自主进食",
    ageRange: "0-2岁",
    lessons: ["母乳和奶量", "辅食准备", "手指食物", "挑食处理", "餐桌规则"]
  },
  {
    id: "rules",
    title: "情绪和规则",
    ageRange: "2-5岁",
    lessons: ["发脾气", "打人咬人", "有限选择", "家庭规则卡", "入园适应"]
  }
];
