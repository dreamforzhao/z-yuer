import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import {
  articles,
  articleLearningMeta,
  careSchedule,
  checkupRecords,
  childProfile,
  decisionTools,
  encyclopediaSections,
  knowledgeTracks,
  products,
  stageRules
} from "./data/seed.js";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(rootDir, "public");
const port = Number(process.env.PORT || 4173);
const today = new Date("2026-06-28T00:00:00+08:00");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function asNumber(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateAge(birthDate) {
  const birth = new Date(`${birthDate}T00:00:00+08:00`);
  if (Number.isNaN(birth.getTime()) || birth > today) {
    return { months: 0, days: 0, label: "出生日期无效" };
  }

  let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;

  const monthBase = new Date(birth);
  monthBase.setMonth(birth.getMonth() + months);
  const days = Math.max(0, Math.floor((today - monthBase) / 86400000));
  return { months, days, label: `${months}个月${days}天` };
}

function getStage(ageMonths) {
  return stageRules.find((stage) => ageMonths <= stage.maxMonth) || stageRules.at(-1);
}

function getCareStatus(ageMonths, nodeAge) {
  if (ageMonths > nodeAge) return "done";
  if (Math.abs(ageMonths - nodeAge) <= 1) return "current";
  return "upcoming";
}

function profileFromQuery(url) {
  return {
    ...childProfile,
    nickname: url.searchParams.get("nickname") || childProfile.nickname,
    birthDate: url.searchParams.get("birthDate") || childProfile.birthDate,
    sex: url.searchParams.get("sex") || childProfile.sex,
    city: url.searchParams.get("city") || childProfile.city,
    feedingType: url.searchParams.get("feedingType") || childProfile.feedingType,
    birthWeightKg: asNumber(url.searchParams.get("birthWeightKg"), childProfile.birthWeightKg),
    birthLengthCm: asNumber(url.searchParams.get("birthLengthCm"), childProfile.birthLengthCm),
    currentWeightKg: asNumber(url.searchParams.get("currentWeightKg"), childProfile.currentWeightKg),
    currentHeightCm: asNumber(url.searchParams.get("currentHeightCm"), childProfile.currentHeightCm),
    latestCheckupDate: url.searchParams.get("latestCheckupDate") || childProfile.latestCheckupDate
  };
}

function buildGrowthAdvice(profile, age) {
  const weightGain = Math.max(0, profile.currentWeightKg - profile.birthWeightKg);
  const heightGain = Math.max(0, profile.currentHeightCm - profile.birthLengthCm);
  const monthlyWeightGain = age.months > 0 ? weightGain / age.months : weightGain;
  const monthlyHeightGain = age.months > 0 ? heightGain / age.months : heightGain;

  const advice = [
    `出生 ${profile.birthWeightKg}kg / ${profile.birthLengthCm}cm，当前 ${profile.currentWeightKg}kg / ${profile.currentHeightCm}cm。`,
    `累计增长约 ${weightGain.toFixed(1)}kg、${heightGain.toFixed(1)}cm，平均每月约 ${monthlyWeightGain.toFixed(2)}kg、${monthlyHeightGain.toFixed(1)}cm。`
  ];

  if (profile.currentWeightKg <= profile.birthWeightKg && age.months > 1) {
    advice.push("当前体重没有超过出生体重，请尽快结合儿保或儿科医生评估。");
  } else if (monthlyWeightGain < 0.25 && age.months <= 12) {
    advice.push("近似月均体重增长偏慢，建议复核喂养量、辅食摄入和儿保曲线。");
  } else {
    advice.push("单次数据只看趋势，不做诊断；建议每次儿保都记录同一套身高体重数据。");
  }

  return {
    weightGainKg: Number(weightGain.toFixed(2)),
    heightGainCm: Number(heightGain.toFixed(1)),
    monthlyWeightGainKg: Number(monthlyWeightGain.toFixed(2)),
    monthlyHeightGainCm: Number(monthlyHeightGain.toFixed(1)),
    advice
  };
}

function hydrateArticle(article) {
  if (!article) return article;
  return {
    ...article,
    learning: articleLearningMeta[article.id] || null
  };
}

function buildKnowledgePayload() {
  return {
    tracks: knowledgeTracks,
    decisionTools,
    sourceNote: "健康内容优先采用权威机构资料整理，产品内展示来源和审核状态。"
  };
}

function getRecommendedLessons(age) {
  const health = knowledgeTracks.find((track) => track.id === "health-foundation");
  const feeding = knowledgeTracks.find((track) => track.id === "feeding-foundation");
  const sleep = knowledgeTracks.find((track) => track.id === "sleep-behavior-foundation");
  if (age.months < 12) return [feeding.modules[0], health.modules[0], health.modules[1]];
  if (age.months < 36) return [feeding.modules[2], sleep.modules[2], health.modules[1]];
  return [sleep.modules[2], health.modules[1], sleep.modules[1]];
}
function buildHome(profile) {
  const age = calculateAge(profile.birthDate);
  const stage = getStage(age.months);
  const growth = buildGrowthAdvice(profile, age);
  const feedingTips = stage.feeding[profile.feedingType] || stage.feeding["混合喂养"];
  const carePreview = careSchedule
    .map((item) => ({ ...item, status: getCareStatus(age.months, item.ageMonth) }))
    .filter((item) => item.status !== "done")
    .slice(0, 3);

  return {
    child: profile,
    age,
    stage: stage.stage,
    focus: stage.focus,
    feedingTips,
    growth,
    carePreview,
    knowledgeTracks,
    decisionTools,
    recommendedLessons: getRecommendedLessons(age),
    commonEntrances: [
      { title: "月龄辅食", target: "feeding-month-guide", type: "article" },
      { title: "辅食开吃", target: "feeding-6m-start", type: "article" },
      { title: "发热判断", target: "fever-home", type: "article" },
      { title: "疫苗儿保", target: "vaccine-checkup", type: "article" },
      { title: "哄睡夜醒", target: "sleep-night-waking", type: "article" },
      { title: "用品评测", target: "gear", type: "section" },
      { title: "情绪行为", target: "behavior", type: "section" },
      { title: "安全座椅", target: "car-seat", type: "product" }
    ]
  };
}

function searchAll(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches = [];

  if (q === "体重" || q === "身高" || q === "身长" || q.includes("身高体重")) {
    return [{ type: "section", id: "health", title: "健康管理", subtitle: "儿保、疫苗、身高体重都在这里" }];
  }

  for (const section of encyclopediaSections) {
    const haystack = [section.title, section.subtitle, ...section.items].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      matches.push({ type: "section", id: section.id, title: section.title, subtitle: section.subtitle });
    }
  }

  for (const article of articles) {
    const learning = articleLearningMeta[article.id];
    const deepText = learning ? [learning.keyQuestion, learning.principle, ...learning.learningGoals, ...learning.commonMistakes].join(" ") : "";
    const haystack = [article.title, article.topic, article.ageRange, ...article.summary, deepText].join(" ").toLowerCase();
    const intentMatch =
      ((q.includes("月龄") || q.includes("怎么做")) && article.id === "feeding-month-guide") ||
      (q.includes("辅食") && article.id === "food-8m") ||
      ((q.includes("发烧") || q.includes("发热")) && article.id === "fever-home") ||
      ((q.includes("哄睡") || q.includes("睡前")) && article.id === "sleep-routine") ||
      ((q.includes("夜醒") || q.includes("睡眠倒退")) && article.id === "sleep-night-waking") ||
      ((q.includes("发脾气") || q.includes("不听话") || q.includes("打人")) && article.id === "tantrum-2y");
    if (haystack.includes(q) || intentMatch) {
      matches.push({ type: "article", id: article.id, title: article.title, subtitle: article.topic });
    }
  }

  for (const product of products) {
    const haystack = [product.title, product.category, product.necessity, ...product.selectionCriteria].join(" ").toLowerCase();
    const intentMatch =
      ((q.includes("座椅") || q.includes("提篮")) && product.id === "car-seat") ||
      ((q.includes("尿不湿") || q.includes("纸尿裤") || q.includes("拉拉裤") || q.includes("红屁屁")) && product.id === "diaper") ||
      ((q.includes("餐椅") || q.includes("餐具") || q.includes("围兜")) && product.id === "high-chair");
    if (haystack.includes(q) || intentMatch) {
      matches.push({ type: "product", id: product.id, title: product.title, subtitle: product.category });
    }
  }

  if (q.includes("疫苗") || q.includes("儿保") || q.includes("体检")) {
    matches.unshift({ type: "article", id: "vaccine-checkup", title: "疫苗和儿保日程", subtitle: "健康 · 本地门诊确认" });
  }

  if (q.includes("体重") || q.includes("身高") || q.includes("身长")) {
    matches.unshift({ type: "section", id: "health", title: "健康管理", subtitle: "儿保、疫苗、身高体重都在这里" });
  }

  const seen = new Set();
  return matches.filter((item) => {
    const key = `${item.type}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

async function serveStatic(pathname, response) {
  const safePath = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function handleApi(url, response) {
  if (url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, service: "parenting-map" });
    return true;
  }

  if (url.pathname === "/api/children/demo") {
    sendJson(response, 200, childProfile);
    return true;
  }

  if (url.pathname === "/api/home" || url.pathname === "/api/today") {
    sendJson(response, 200, buildHome(profileFromQuery(url)));
    return true;
  }

  if (url.pathname === "/api/knowledge") {
    sendJson(response, 200, buildKnowledgePayload());
    return true;
  }

  if (url.pathname === "/api/encyclopedia") {
    sendJson(response, 200, encyclopediaSections.map((section) => ({
      ...section,
      articles: articles.filter((article) => article.sectionId === section.id).map(hydrateArticle),
      products: products.filter((product) => product.sectionId === section.id)
    })));
    return true;
  }

  if (url.pathname === "/api/articles") {
    const sectionId = url.searchParams.get("sectionId");
    const result = sectionId ? articles.filter((article) => article.sectionId === sectionId) : articles;
    sendJson(response, 200, result.map(hydrateArticle));
    return true;
  }

  if (url.pathname.startsWith("/api/articles/")) {
    const id = decodeURIComponent(url.pathname.split("/").at(-1));
    const article = hydrateArticle(articles.find((item) => item.id === id));
    sendJson(response, article ? 200 : 404, article || { error: "ARTICLE_NOT_FOUND" });
    return true;
  }

  if (url.pathname === "/api/products") {
    sendJson(response, 200, products);
    return true;
  }

  if (url.pathname.startsWith("/api/products/")) {
    const id = decodeURIComponent(url.pathname.split("/").at(-1));
    const product = products.find((item) => item.id === id);
    sendJson(response, product ? 200 : 404, product || { error: "PRODUCT_NOT_FOUND" });
    return true;
  }

  if (url.pathname === "/api/care-schedule") {
    const profile = profileFromQuery(url);
    const age = calculateAge(profile.birthDate);
    sendJson(response, 200, {
      city: profile.city,
      age,
      records: checkupRecords,
      items: careSchedule.map((item) => ({ ...item, status: getCareStatus(age.months, item.ageMonth) }))
    });
    return true;
  }

  if (url.pathname === "/api/growth-records") {
    const profile = profileFromQuery(url);
    const age = calculateAge(profile.birthDate);
    sendJson(response, 200, {
      profile,
      age,
      growth: buildGrowthAdvice(profile, age),
      records: checkupRecords
    });
    return true;
  }

  if (url.pathname === "/api/search") {
    sendJson(response, 200, { query: url.searchParams.get("q") || "", results: searchAll(url.searchParams.get("q") || "") });
    return true;
  }

  return false;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    if (!handleApi(url, response)) {
      sendJson(response, 404, { error: "API_NOT_FOUND" });
    }
    return;
  }

  await serveStatic(url.pathname, response);
});

server.listen(port, () => {
  console.log(`Parenting Map running at http://localhost:${port}`);
});
