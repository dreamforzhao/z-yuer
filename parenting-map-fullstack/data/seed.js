export const childProfile = {
  id: "demo",
  nickname: "昕昕",
  birthDate: "2025-10-16",
  sex: "男孩",
  city: "上海",
  feedingType: "混合喂养",
  birthWeightKg: 3.25,
  birthLengthCm: 50,
  currentWeightKg: 8.4,
  currentHeightCm: 70.5,
  latestCheckupDate: "2026-06-20",
  allergies: ["暂无"],
  caregivers: ["妈妈", "爸爸", "外婆"]
};

export const checkupRecords = [
  { ageMonth: 1, date: "2025-11-16", weightKg: 4.3, heightCm: 54.2, note: "满月儿保，喂养稳定。" },
  { ageMonth: 3, date: "2026-01-16", weightKg: 6.1, heightCm: 61.5, note: "抬头和追视良好。" },
  { ageMonth: 6, date: "2026-04-16", weightKg: 7.6, heightCm: 67.2, note: "准备添加辅食，关注铁摄入。" },
  { ageMonth: 8, date: "2026-06-20", weightKg: 8.4, heightCm: 70.5, note: "辅食练习中，继续观察过敏反应。" }
];

export const stageRules = [
  {
    maxMonth: 6,
    stage: "0-6个月",
    focus: ["喂养稳定", "安全睡眠", "黄疸/湿疹/红屁屁护理", "提篮或反向安全座椅"],
    feeding: {
      母乳: ["关注含乳姿势、尿量和体重增长。", "母乳家庭不需要用奶量焦虑替代生长观察。"],
      奶粉: ["按奶粉说明冲调，避免过浓或过稀。", "观察吐奶、便便和皮肤反应。"],
      混合喂养: ["先稳定母乳和奶粉节奏，再看体重增长。", "记录每天大致奶量和尿量，避免频繁换奶粉。"]
    }
  },
  {
    maxMonth: 12,
    stage: "7-12个月",
    focus: ["辅食推进", "爬行和精细动作", "分离焦虑", "餐椅/尿不湿/家居安全"],
    feeding: {
      母乳: ["继续母乳，同时把辅食作为练习咀嚼和吞咽的机会。", "逐步增加富铁食物，观察过敏。"],
      奶粉: ["奶仍是重要营养来源，辅食逐步丰富。", "不要用零食或果汁替代正餐辅食。"],
      混合喂养: ["保持奶量基本稳定，辅食从少量到多样。", "优先练习自主抓握和餐椅进食。"]
    }
  },
  {
    maxMonth: 24,
    stage: "1-2岁",
    focus: ["自主进食", "语言回应", "走路后的安全", "拉拉裤/如厕准备"],
    feeding: {
      母乳: ["可以继续母乳，但家庭餐和自主进食要逐步成为重点。", "避免夜奶影响牙齿清洁和睡眠节律。"],
      奶粉: ["关注整体饮食结构，不让奶挤占正餐。", "杯饮练习可以逐步替代奶瓶依赖。"],
      混合喂养: ["把规律三餐和家庭餐作为主线。", "奶、饭、睡眠和户外活动一起看，不单看某一项。"]
    }
  },
  {
    maxMonth: 36,
    stage: "2-3岁",
    focus: ["情绪和规则", "如厕训练", "亲子阅读", "入托准备"],
    feeding: {
      母乳: ["如果仍在母乳，重点是边界和家庭节奏，而不是突然强行断。", "三餐、牙齿清洁和睡眠规则要同步稳定。"],
      奶粉: ["奶粉不应替代正餐和咀嚼练习。", "继续观察挑食、便秘和口腔清洁。"],
      混合喂养: ["这个阶段重点转向家庭餐、规则和表达能力。", "少用食物作为奖励或交换。"]
    }
  },
  {
    maxMonth: 72,
    stage: "3-5岁",
    focus: ["入园适应", "社交表达", "运动和睡眠", "安全教育"],
    feeding: {
      母乳: ["若仍有母乳，需要把亲密关系和规则边界分开处理。", "饮食重点是均衡、咀嚼和家庭餐。"],
      奶粉: ["避免用奶粉替代多样化饮食。", "关注身高体重趋势、运动和睡眠。"],
      混合喂养: ["以家庭餐、运动、睡眠和入园作息为主线。", "减少屏幕进食和边玩边吃。"]
    }
  }
];

export const encyclopediaSections = [
  {
    id: "feeding",
    title: "喂养营养",
    subtitle: "母乳、奶粉、辅食、挑食、餐具",
    icon: "喂",
    items: ["母乳衔乳", "奶粉冲调", "辅食添加", "过敏观察", "自主进食", "挑食处理"]
  },
  {
    id: "health",
    title: "健康护理",
    subtitle: "发烧、腹泻、湿疹、便秘、就医判断",
    icon: "护",
    items: ["发热判断", "腹泻护理", "湿疹护理", "便秘", "误食", "摔伤"]
  },
  {
    id: "sleep",
    title: "睡眠哄睡",
    subtitle: "安全睡眠、夜醒、抱睡转床、睡眠倒退",
    icon: "睡",
    items: ["安全睡眠", "睡前流程", "夜醒处理", "抱睡转床", "怕黑噩梦"]
  },
  {
    id: "growth",
    title: "发育教育",
    subtitle: "动作、语言、认知、社交、亲子阅读",
    icon: "育",
    items: ["大运动", "精细动作", "语言表达", "亲子阅读", "游戏活动"]
  },
  {
    id: "behavior",
    title: "行为情绪",
    subtitle: "发脾气、打人、咬人、分离焦虑、规则",
    icon: "情",
    items: ["发脾气", "打人咬人", "说不", "分离焦虑", "规则建立"]
  },
  {
    id: "gear",
    title: "用品安全",
    subtitle: "安全座椅、提篮、尿不湿、餐椅、家居安全",
    icon: "物",
    items: ["安全座椅", "婴儿提篮", "尿不湿", "餐椅", "推车", "家居防护"]
  },
  {
    id: "school",
    title: "入园准备",
    subtitle: "自理、表达、分离、作息、社交",
    icon: "园",
    items: ["独立如厕", "表达需求", "午睡作息", "分离告别", "同伴冲突"]
  },
  {
    id: "parents",
    title: "父母支持",
    subtitle: "分工、老人沟通、复工、情绪压力",
    icon: "家",
    items: ["照护分工", "老人沟通", "复工准备", "父母情绪"]
  }
];

export const articles = [
  {
    id: "food-8m",
    sectionId: "feeding",
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
    sectionId: "health",
    title: "孩子发热时先判断什么",
    topic: "健康护理",
    ageRange: "0-5岁",
    summary: ["体温只是一个指标，精神状态、呼吸、饮水和尿量同样重要。", "小月龄、抽搐、呼吸困难、精神差需要尽快就医。", "不要叠加使用退热药。"],
    steps: ["记录体温和时间。", "观察精神状态、呼吸、尿量和皮疹。", "按医生建议或药品说明使用退热药。"],
    risks: ["3月龄以下发热", "抽搐", "呼吸困难", "明显脱水", "精神反应差"],
    resources: []
  },
  {
    id: "sleep-routine",
    sectionId: "sleep",
    title: "怎么建立睡前流程",
    topic: "睡眠哄睡",
    ageRange: "0-5岁",
    summary: ["睡前流程的重点是稳定、短、可重复。", "不要把哄睡变成每晚临时谈判。", "打鼾、憋醒或长期白天嗜睡需要咨询医生。"],
    steps: ["固定开始时间。", "洗澡、拉窗帘、读书、关灯保持顺序。", "夜醒时低刺激回应。"],
    risks: ["持续打鼾", "呼吸暂停样表现", "白天嗜睡明显"],
    resources: [{ title: "崔玉涛睡眠相关视频搜索", url: "https://www.bilibili.com/search?keyword=%E5%B4%94%E7%8E%89%E6%B6%9B%20%E5%AE%9D%E5%AE%9D%20%E7%9D%A1%E7%9C%A0" }]
  },
  {
    id: "tantrum-2y",
    sectionId: "behavior",
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
    sectionId: "gear",
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
    sectionId: "gear",
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
    sectionId: "gear",
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
