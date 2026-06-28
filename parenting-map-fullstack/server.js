import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import {
  articles,
  careSchedule,
  childProfile,
  learningPaths,
  products,
  stageRecommendations
} from "./data/seed.js";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(rootDir, "public");
const port = Number(process.env.PORT || 4173);
const today = new Date("2026-06-28T00:00:00+08:00");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload, null, 2));
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
  return stageRecommendations.find((stage) => ageMonths <= stage.maxMonth) || stageRecommendations.at(-1);
}

function getCareStatus(ageMonths, nodeAge) {
  if (ageMonths > nodeAge) return "done";
  if (Math.abs(ageMonths - nodeAge) <= 1) return "current";
  return "upcoming";
}

function buildToday(profile) {
  const age = calculateAge(profile.birthDate);
  const stage = getStage(age.months);
  return {
    child: profile,
    age,
    stage: stage.stage,
    today: stage.today,
    sleep: stage.sleep,
    cards: stage.cards,
    carePreview: careSchedule
      .map((item) => ({ ...item, status: getCareStatus(age.months, item.ageMonth) }))
      .filter((item) => item.status !== "done")
      .slice(0, 3)
  };
}

function searchAll(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches = [];
  for (const article of articles) {
    const haystack = [article.title, article.topic, article.ageRange, ...article.summary].join(" ").toLowerCase();
    const intentMatch =
      (q.includes("辅食") && article.id === "food-8m") ||
      ((q.includes("发烧") || q.includes("发热")) && article.id === "fever-home") ||
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

  for (const path of learningPaths) {
    const haystack = [path.title, path.ageRange, ...path.lessons].join(" ").toLowerCase();
    if (haystack.includes(q) || q.includes("哄睡") || q.includes("睡")) {
      matches.push({ type: "learning", id: path.id, title: path.title, subtitle: path.ageRange });
    }
  }

  if (q.includes("疫苗") || q.includes("儿保") || q.includes("体检")) {
    matches.unshift({ type: "care", id: "schedule", title: "疫苗与儿保时间轴", subtitle: `${childProfile.city} · 本地门诊确认` });
  }

  return matches.slice(0, 8);
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

function handleApi(url, request, response) {
  if (url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, service: "parenting-map" });
    return true;
  }

  if (url.pathname === "/api/children/demo") {
    sendJson(response, 200, childProfile);
    return true;
  }

  if (url.pathname === "/api/today") {
    const birthDate = url.searchParams.get("birthDate") || childProfile.birthDate;
    const sex = url.searchParams.get("sex") || childProfile.sex;
    const city = url.searchParams.get("city") || childProfile.city;
    sendJson(response, 200, buildToday({ ...childProfile, birthDate, sex, city }));
    return true;
  }

  if (url.pathname === "/api/articles") {
    const topic = url.searchParams.get("topic");
    const result = topic ? articles.filter((article) => article.topic === topic) : articles;
    sendJson(response, 200, result);
    return true;
  }

  if (url.pathname.startsWith("/api/articles/")) {
    const id = decodeURIComponent(url.pathname.split("/").at(-1));
    const article = articles.find((item) => item.id === id);
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
    const birthDate = url.searchParams.get("birthDate") || childProfile.birthDate;
    const age = calculateAge(birthDate);
    sendJson(response, 200, {
      city: url.searchParams.get("city") || childProfile.city,
      age,
      items: careSchedule.map((item) => ({ ...item, status: getCareStatus(age.months, item.ageMonth) }))
    });
    return true;
  }

  if (url.pathname === "/api/learning-paths") {
    sendJson(response, 200, learningPaths);
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
    if (!handleApi(url, request, response)) {
      sendJson(response, 404, { error: "API_NOT_FOUND" });
    }
    return;
  }

  await serveStatic(url.pathname, response);
});

server.listen(port, () => {
  console.log(`Parenting Map running at http://localhost:${port}`);
});
