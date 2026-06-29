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
    title: "喂养",
    subtitle: "按月龄看奶量、辅食、过敏、挑食",
    icon: "喂",
    items: ["0-6月奶量", "6月辅食开始", "7-9月手指食物", "过敏观察", "挑食处理", "餐具餐椅"]
  },
  {
    id: "health",
    title: "健康",
    subtitle: "发烧护理、疫苗接种、儿保体检、就医判断",
    icon: "护",
    items: ["发热判断", "疫苗时间轴", "儿保体检", "湿疹护理", "腹泻便秘", "就医红线"]
  },
  {
    id: "sleep",
    title: "睡眠",
    subtitle: "哄睡、夜醒、睡眠倒退、安全睡眠",
    icon: "睡",
    items: ["睡前流程", "夜醒处理", "抱睡转床", "白天小睡", "安全睡眠", "睡眠倒退"]
  },
  {
    id: "gear",
    title: "用品",
    subtitle: "先看结论，再看评测、选购维度和视频分析",
    icon: "物",
    items: ["安全座椅", "尿不湿", "餐椅餐具", "推车", "湿巾", "家居防护"]
  },
  {
    id: "behavior",
    title: "行为",
    subtitle: "发脾气、打人、分离焦虑、规则建立",
    icon: "情",
    items: ["说不", "发脾气", "打人咬人", "分离焦虑", "规则建立", "亲子沟通"]
  }
];
export const articles = [
  {
    id: "feeding-6m-start",
    sectionId: "feeding",
    title: "6个月第一次加辅食怎么做",
    topic: "喂养",
    ageRange: "6-7个月",
    summary: ["先从富铁泥糊开始，目标是练习吞咽和观察过敏。", "每次只试一种新食材，连续观察 2-3 天。", "奶仍是主要营养来源，不要因为辅食焦虑而强迫进食。"],
    steps: ["选择米粉、肉泥、蛋黄或蔬菜泥等单一食材。", "白天精神好时喂 1-2 小勺，坐稳并全程看护。", "记录皮疹、呕吐、腹泻、便血等反应，再逐步增加种类。"],
    risks: ["明显过敏", "吞咽困难", "持续呕吐", "体重下降"],
    resources: [
      { title: "WHO 婴幼儿喂养建议", url: "https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding" },
      { title: "B站辅食添加视频分析", url: "https://www.bilibili.com/search?keyword=%E8%BE%85%E9%A3%9F%20%E6%B7%BB%E5%8A%A0%206%E4%B8%AA%E6%9C%88" }
    ]
  },
  {
    id: "food-8m",
    sectionId: "feeding",
    title: "8个月不爱吃辅食怎么办",
    topic: "喂养",
    ageRange: "7-12个月",
    summary: ["辅食初期目标是练习，不是立刻吃很多。", "连续拒绝不代表不喜欢，可隔几天换形态再试。", "不要追喂、强迫、用零食交换。"],
    steps: ["餐前 2 小时避免大量奶和零食。", "每次只上 1-2 种食物，分量从一两勺开始。", "让孩子自己摸、抓、尝，家长负责安全和节奏。"],
    risks: ["体重下降", "反复呕吐", "吞咽困难", "明显过敏反应"],
    resources: [{ title: "B站辅食问题视频分析", url: "https://www.bilibili.com/search?keyword=%E5%AE%9D%E5%AE%9D%20%E8%BE%85%E9%A3%9F%20%E4%B8%8D%E7%88%B1%E5%90%83" }]
  },
  {
    id: "feeding-month-guide",
    sectionId: "feeding",
    title: "6-12个月辅食月龄表",
    topic: "喂养",
    ageRange: "6-12个月",
    summary: ["先按月龄看质地，再看食材种类，不需要一上来做复杂菜谱。", "6月龄偏泥糊，7-9月龄逐步增加颗粒和手指食物，10-12月龄靠近家庭餐。", "每次新增食材都要留出观察窗口，过敏风险比花样更重要。"],
    steps: ["6月龄：富铁米粉、肉泥、蛋黄、蔬菜泥，从少量开始。", "7-9月龄：软烂颗粒、蒸软条状食物，练习抓握和咀嚼。", "10-12月龄：碎菜、软饭、面条、肉末，少盐少糖，跟家庭餐逐步衔接。"],
    risks: ["噎呛风险", "明显过敏", "持续拒食", "体重增长明显放缓"],
    resources: [{ title: "B站月龄辅食做法分析", url: "https://www.bilibili.com/search?keyword=6-12%E4%B8%AA%E6%9C%88%20%E8%BE%85%E9%A3%9F%20%E5%81%9A%E6%B3%95" }]
  },  {
    id: "fever-home",
    sectionId: "health",
    title: "孩子发热时先判断什么",
    topic: "健康",
    ageRange: "0-5岁",
    summary: ["体温只是一个指标，精神状态、呼吸、饮水和尿量同样重要。", "小月龄、抽搐、呼吸困难、精神差需要尽快就医。", "不要叠加使用退热药。"],
    steps: ["记录体温和时间。", "观察精神状态、呼吸、尿量和皮疹。", "按医生建议或药品说明使用退热药。"],
    risks: ["3月龄以下发热", "抽搐", "呼吸困难", "明显脱水", "精神反应差"],
    resources: [{ title: "B站儿童发热科普分析", url: "https://www.bilibili.com/search?keyword=%E5%84%BF%E7%AB%A5%20%E5%8F%91%E7%83%AD%20%E5%84%BF%E7%A7%91" }]
  },
  {
    id: "vaccine-checkup",
    sectionId: "health",
    title: "疫苗和儿保要怎么放进日程",
    topic: "健康",
    ageRange: "0-6岁",
    summary: ["疫苗和儿保本质上都属于健康管理，不需要单独占一个主导航。", "App 应展示节点、准备材料、接种后观察和异常处理。", "最终以当地接种门诊和社区卫生服务中心为准。"],
    steps: ["按月龄查看最近 3 个健康节点。", "提前确认预约、接种本、过敏史和近期发热情况。", "接种后观察精神、皮疹、呼吸、持续高热等情况。"],
    risks: ["接种后呼吸困难", "持续高热", "精神差", "严重过敏表现"],
    resources: [{ title: "B站疫苗接种科普分析", url: "https://www.bilibili.com/search?keyword=%E5%84%BF%E7%AB%A5%20%E7%96%AB%E8%8B%97%20%E6%8E%A5%E7%A7%8D" }]
  },
  {
    id: "sleep-routine",
    sectionId: "sleep",
    title: "怎么建立睡前流程",
    topic: "睡眠",
    ageRange: "0-5岁",
    summary: ["睡前流程的重点是稳定、短、可重复。", "不要把哄睡变成每晚临时谈判。", "打鼾、憋醒或长期白天嗜睡需要咨询医生。"],
    steps: ["固定开始时间。", "洗澡、拉窗帘、读书、关灯保持顺序。", "夜醒时低刺激回应。"],
    risks: ["持续打鼾", "呼吸暂停样表现", "白天嗜睡明显"],
    resources: [{ title: "B站哄睡方法视频分析", url: "https://www.bilibili.com/search?keyword=%E5%AE%9D%E5%AE%9D%20%E5%93%84%E7%9D%A1" }]
  },
  {
    id: "sleep-night-waking",
    sectionId: "sleep",
    title: "夜醒频繁时先排查什么",
    topic: "睡眠",
    ageRange: "0-5岁",
    summary: ["先排查发热、鼻塞、湿疹、出牙、饥饿和白天作息，再谈睡眠训练。", "夜醒处理要低刺激、短回应，避免每次都升级成开灯玩耍。", "如果伴随打鼾、呼吸暂停样表现或白天明显嗜睡，要优先就医咨询。"],
    steps: ["记录连续 3 天入睡时间、夜醒次数、奶量和白天小睡。", "固定夜间回应方式：轻拍、安抚语、少说话、不开强光。", "白天补足活动和小睡，不把夜醒简单归因于孩子不乖。"],
    risks: ["呼吸异常", "持续打鼾", "白天精神差", "体重增长异常"],
    resources: [{ title: "B站夜醒处理视频分析", url: "https://www.bilibili.com/search?keyword=%E5%AE%9D%E5%AE%9D%20%E5%A4%9C%E9%86%92%20%E5%93%84%E7%9D%A1" }]
  },  {
    id: "tantrum-2y",
    sectionId: "behavior",
    title: "2岁孩子总说“不”怎么回应",
    topic: "行为",
    ageRange: "2-3岁",
    summary: ["先承认孩子想自己做的愿望。", "给有限选择，不开放式争论。", "家长先稳定语气，比讲大道理更重要。"],
    steps: ["说出情绪：你很想自己来。", "给选择：你想先穿鞋还是先拿水杯？", "守住底线：不能打人，可以跺脚或抱抱。"],
    risks: ["持续攻击行为", "明显语言倒退", "家庭照护人反应严重不一致"],
    resources: [{ title: "B站幼儿情绪管理视频分析", url: "https://www.bilibili.com/search?keyword=2%E5%B2%81%20%E5%8F%91%E8%84%BE%E6%B0%94%20%E8%82%B2%E5%84%BF" }]
  }
];
export const articleLearningMeta = {
  "fever-home": {
    depth: "健康判断核心课",
    readingMinutes: 12,
    sourceLevel: "权威来源整理",
    learningGoals: ["知道发热不是只看温度", "学会先看精神状态、呼吸、饮水和尿量", "记住需要尽快就医的红线"],
    keyQuestion: "孩子发热时，家长第一步到底该判断什么？",
    principle: "体温是信号，不是全部。小月龄、精神反应、呼吸状态、饮水尿量、皮疹和抽搐风险，比单个温度数字更能决定下一步。",
    decisionFramework: {
      title: "4 步判断框架",
      points: ["先确认月龄：3月龄以下发热更谨慎。", "再看精神：能否互动、安抚后是否好转。", "再看呼吸和循环：有没有呼吸费力、嘴唇发紫、明显脱水。", "最后看体温变化和伴随症状：持续高热、抽搐、皮疹、反复呕吐都要提高警惕。"]
    },
    commonMistakes: ["只盯着 38.5 度，忽略精神状态。", "捂汗、酒精擦浴或自行叠加退热药。", "孩子明显萎靡时还继续在家观察很久。"],
    cases: ["8个月孩子 38.7 度，但能玩、能喝水、尿量正常：先记录体温和精神状态，按说明处理并观察。", "2个月孩子 38.1 度：不要只因为温度不高就放松，应尽快联系医生或就医。"],
    checkpoints: ["我能说出发热的 4 个观察维度", "我知道哪些情况不能等", "我知道退热药不是治疗病因"],
    citations: [
      { title: "AAP HealthyChildren 发热科普", url: "https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/default.aspx" },
      { title: "Mayo Clinic 儿童发热处理", url: "https://www.mayoclinic.org/diseases-conditions/fever/in-depth/fever/art-20050997" }
    ]
  },
  "feeding-month-guide": {
    depth: "喂养基础核心课",
    readingMinutes: 14,
    sourceLevel: "权威来源整理",
    learningGoals: ["理解辅食不是越复杂越好", "按月龄掌握质地变化", "知道过敏观察和铁摄入为什么重要"],
    keyQuestion: "6-12个月辅食到底学什么：食谱、月龄，还是能力？",
    principle: "辅食的核心不是做花样，而是补充能量和关键营养、练习吞咽咀嚼、建立进食习惯，并在安全边界内逐步扩大食物经验。",
    decisionFramework: {
      title: "按能力推进，而不是按网红食谱推进",
      points: ["6月龄先看是否能较好控制头颈、对食物有兴趣。", "先从富铁食物和泥糊开始，少量尝试。", "7-9月龄逐步增加颗粒、软条和手指食物。", "10-12月龄逐步接近家庭餐，但仍要少盐少糖、避免噎呛。"]
    },
    commonMistakes: ["把辅食吃得多当作唯一目标。", "每天换很多新食材，过敏后难以判断来源。", "过早给坚硬、圆形、黏性强的高噎呛风险食物。"],
    cases: ["6个半月只吃几勺泥糊：如果精神、奶量、生长曲线稳定，多数时候重点是练习，不是强迫吃完。", "8个月拒绝某种蔬菜泥：可以隔几天换形态再试，不需要立刻贴上挑食标签。"],
    checkpoints: ["我能按月龄说出质地变化", "我知道新增食材要观察", "我能区分练习进食和营养摄入"],
    citations: [
      { title: "WHO 婴幼儿喂养事实表", url: "https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding" },
      { title: "CDC 婴幼儿营养", url: "https://www.cdc.gov/infant-toddler-nutrition/" }
    ]
  },
  "vaccine-checkup": {
    depth: "健康管理核心课",
    readingMinutes: 10,
    sourceLevel: "公共卫生规范整理",
    learningGoals: ["理解疫苗和儿保都属于健康管理", "知道接种前后要观察什么", "把本地门诊确认作为最终依据"],
    keyQuestion: "疫苗、儿保、体检为什么应该放在同一条健康管理线里？",
    principle: "疫苗解决免疫保护，儿保解决生长发育和风险筛查。两者都不是孤立提醒，而是按月龄持续管理孩子健康。",
    decisionFramework: {
      title: "每次健康节点看 3 件事",
      points: ["这次要完成什么：疫苗、体检、发育筛查或口腔视力等。", "去之前准备什么：接种本、过敏史、近期发热和用药情况。", "回来后观察什么：精神、皮疹、呼吸、发热持续时间和局部反应。"]
    },
    commonMistakes: ["只记日期，不理解这次节点要筛查什么。", "孩子近期明显不适时不提前咨询门诊。", "接种后出现严重过敏表现还继续在家观察。"],
    cases: ["8月龄准备接种：提前确认本地程序、近期是否发热、是否有严重过敏史。", "1岁儿保：除了身高体重，还要关注语言理解、站立行走、牙齿和喂养。"],
    checkpoints: ["我知道接种前要主动告知近期健康情况", "我知道儿保不是只称体重", "我会把本地门诊规则作为最终准则"],
    citations: [
      { title: "国家基本公共卫生服务规范", url: "https://www.gov.cn/" },
      { title: "中国疾控中心免疫规划", url: "https://www.chinacdc.cn/" }
    ]
  },
  "food-8m": {
    depth: "喂养问题课",
    readingMinutes: 9,
    sourceLevel: "喂养原则整理",
    learningGoals: ["理解拒绝辅食不等于失败", "学会从节奏、质地、环境排查", "避免追喂和强迫"],
    keyQuestion: "孩子不吃辅食，是不会吃、不想吃，还是家长节奏太急？",
    principle: "辅食早期是能力学习。家长负责提供安全、合适、规律的食物，孩子负责决定吃多少。",
    decisionFramework: {
      title: "从 4 个变量排查",
      points: ["时间：是否刚喝完奶或太困。", "质地：是否太稠、太细、太硬或变化太快。", "方式：是否被追喂、逗喂、强迫。", "健康：是否出牙不适、便秘、过敏或生病。"]
    },
    commonMistakes: ["为了多吃几口不断追喂。", "用零食交换正餐。", "把短期拒绝理解成永久挑食。"],
    cases: ["8个月吃两口就扭头：先减量、固定餐椅、让孩子自己摸和尝。", "连续多天明显少吃且精神差：优先排查健康问题。"],
    checkpoints: ["我知道辅食初期目标是练习", "我能排查时间和质地", "我不会用强迫换短期进食量"],
    citations: [{ title: "CDC 婴幼儿营养", url: "https://www.cdc.gov/infant-toddler-nutrition/" }]
  }
};

export const knowledgeTracks = [
  {
    id: "health-foundation",
    sectionId: "health",
    title: "健康判断课",
    subtitle: "先学会判断，再决定观察、护理还是就医",
    level: "必学",
    progress: 0.35,
    lessonCount: 8,
    outcomes: ["会看精神状态", "知道就医红线", "能管理疫苗儿保节点"],
    modules: [
      { title: "发热不是只看温度", articleId: "fever-home", minutes: 12 },
      { title: "疫苗和儿保是一条健康线", articleId: "vaccine-checkup", minutes: 10 },
      { title: "身高体重看趋势，不看单点", articleId: "vaccine-checkup", minutes: 8 }
    ]
  },
  {
    id: "feeding-foundation",
    sectionId: "feeding",
    title: "喂养基础课",
    subtitle: "从奶、辅食、过敏、咀嚼能力建立喂养判断力",
    level: "必学",
    progress: 0.28,
    lessonCount: 10,
    outcomes: ["理解月龄辅食", "会观察过敏", "能处理短期拒食"],
    modules: [
      { title: "6-12个月辅食月龄表", articleId: "feeding-month-guide", minutes: 14 },
      { title: "第一次加辅食怎么做", articleId: "feeding-6m-start", minutes: 8 },
      { title: "不爱吃辅食怎么排查", articleId: "food-8m", minutes: 9 }
    ]
  },
  {
    id: "sleep-behavior-foundation",
    sectionId: "sleep",
    title: "睡眠与行为课",
    subtitle: "把夜醒、哄睡、情绪和规则放到发展阶段里看",
    level: "进阶",
    progress: 0.12,
    lessonCount: 6,
    outcomes: ["能排查夜醒", "减少哄睡拉扯", "理解情绪发展"],
    modules: [
      { title: "夜醒频繁先排查什么", articleId: "sleep-night-waking", minutes: 9 },
      { title: "建立睡前流程", articleId: "sleep-routine", minutes: 7 },
      { title: "2岁说不怎么回应", articleId: "tantrum-2y", minutes: 8 }
    ]
  }
];

export const decisionTools = [
  {
    id: "fever-triage",
    title: "发热先判断",
    sectionId: "health",
    articleId: "fever-home",
    question: "现在是观察、护理，还是需要尽快就医？",
    checks: ["月龄是否小于3个月", "精神反应是否明显变差", "呼吸是否费力", "饮水和尿量是否明显减少"],
    redFlags: ["抽搐", "呼吸困难", "明显脱水", "精神反应差"]
  },
  {
    id: "feeding-readiness",
    title: "辅食准备度",
    sectionId: "feeding",
    articleId: "feeding-month-guide",
    question: "孩子是准备好了，还是家长被月龄焦虑推着走？",
    checks: ["能较好控制头颈", "对食物有兴趣", "能坐稳或有支撑坐稳", "没有明显生病不适"],
    redFlags: ["吞咽困难", "反复呕吐", "明显过敏", "体重增长明显放缓"]
  }
];
export const products = [
  {
    id: "car-seat",
    sectionId: "gear",
    title: "儿童安全座椅/提篮",
    verdict: "有车家庭优先级最高，先选安装方式和阶段，不先看品牌。",
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
    verdict: "没有全能款，按体重、红屁屁、夜用和活动量分场景试。",
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
    verdict: "餐椅先看稳定和束缚，餐具先看材质和清洁，不买成套也可以。",
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
