/**
 * 每日运营自动化脚本
 * 执行顺序：索引刷新 → AI 文章生成 → 日志输出
 * 用法：npx tsx scripts/daily-ops.ts
 */

import { execSync } from "child_process";

const log = (msg: string) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
};

async function main() {
  log("=== TG960W 每日运营开始 ===");

  // Step 1: Re-index skills
  log("Step 1/3: 刷新智能体索引...");
  try {
    execSync("npx tsx scripts/index-skills.ts", {
      cwd: "C:/Users/78526/skillos",
      stdio: "inherit",
      timeout: 120_000,
    });
    log("  ✅ 索引刷新完成");
  } catch (err) {
    log(`  ⚠️ 索引刷新失败: ${err}`);
  }

  // Step 2: Generate AI article
  log("Step 2/3: AI 生成教程文章...");
  try {
    execSync("npx tsx scripts/generate-article.ts", {
      cwd: "C:/Users/78526/skillos",
      stdio: "inherit",
      timeout: 180_000,
    });
    log("  ✅ 文章生成完成");
  } catch (err) {
    log(`  ⚠️ 文章生成失败: ${err}`);
  }

  // Step 3: Optional social post
  log("Step 3/3: 社媒分发...");
  try {
    execSync("npx tsx scripts/social-post.ts", {
      cwd: "C:/Users/78526/skillos",
      stdio: "inherit",
      timeout: 60_000,
    });
    log("  ✅ 社媒分发完成");
  } catch {
    log("  ℹ️ 社媒分发跳过（未配置或无可分发内容）");
  }

  log("=== TG960W 每日运营完成 ===");
}

main().catch(console.error);
