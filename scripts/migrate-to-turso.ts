import { createClient } from "@libsql/client";
import { PrismaClient as PC } from "@/prisma-client/client";
import type { PrismaClient } from "@/prisma-client/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const TURSO_URL = process.env.TURSO_URL!;
const TURSO_TOKEN = process.env.TURSO_TOKEN!;

const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
const adapter = new PrismaLibSql({ url: "file:./prisma/skillos.db" });
const local = new (PC as any)({ adapter }) as PrismaClient;

async function migrate() {
  // Create tables if not exists
  const DDL = [
    `CREATE TABLE IF NOT EXISTS Skill (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, fullContent TEXT NOT NULL, category TEXT NOT NULL, subcategory TEXT, tags TEXT DEFAULT '[]', tier TEXT, author TEXT, version TEXT, sourcePath TEXT NOT NULL, sourceType TEXT DEFAULT 'direct', parentGroup TEXT, isIndexed INTEGER DEFAULT 1, createdAt TEXT, updatedAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS Article (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, content TEXT NOT NULL, excerpt TEXT NOT NULL, coverImage TEXT, category TEXT NOT NULL, tags TEXT DEFAULT '[]', author TEXT DEFAULT 'TG960W', relatedSkills TEXT DEFAULT '[]', isPublished INTEGER DEFAULT 0, publishedAt TEXT, createdAt TEXT, updatedAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS SEOMeta (id TEXT PRIMARY KEY, path TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, keywords TEXT, ogImage TEXT, createdAt TEXT, updatedAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS Favorite (id TEXT PRIMARY KEY, skillId TEXT UNIQUE NOT NULL, createdAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS History (id TEXT PRIMARY KEY, skillId TEXT NOT NULL, action TEXT DEFAULT 'view', context TEXT, createdAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS Agent (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, icon TEXT DEFAULT '🤖', category TEXT DEFAULT 'general', goal TEXT NOT NULL, skillChain TEXT DEFAULT '[]', config TEXT DEFAULT '{}', isTemplate INTEGER DEFAULT 1, isPublic INTEGER DEFAULT 1, runCount INTEGER DEFAULT 0, lastRunAt TEXT, createdAt TEXT, updatedAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS AgentRun (id TEXT PRIMARY KEY, agentId TEXT NOT NULL, status TEXT DEFAULT 'pending', steps TEXT DEFAULT '[]', result TEXT, error TEXT, startedAt TEXT, completedAt TEXT, createdAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS Workflow (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, isBuiltIn INTEGER DEFAULT 0, runCount INTEGER DEFAULT 0, lastRunAt TEXT, createdAt TEXT, updatedAt TEXT)`,
    `CREATE TABLE IF NOT EXISTS WorkflowStep (id TEXT PRIMARY KEY, workflowId TEXT NOT NULL, skillId TEXT NOT NULL, orderIndex INTEGER NOT NULL, config TEXT, label TEXT)`,
    `CREATE TABLE IF NOT EXISTS Setting (id TEXT PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT NOT NULL)`,
  ];
  for (const sql of DDL) await turso.execute(sql);
  console.log("Tables ready");

  // Check existing skill count
  const cnt = await turso.execute("SELECT count(*) as c FROM Skill");
  const existing = Number(cnt.rows[0].c);
  console.log(`Turso has ${existing} skills`);

  if (existing > 1200) { console.log("Already migrated!"); await local.$disconnect(); return; }

  // Migrate skills from offset
  const skills = await (local as any).skill.findMany({ skip: existing, take: 5000 });
  console.log(`Migrating ${skills.length} skills...`);

  for (let i = 0; i < skills.length; i += 50) {
    const batch = skills.slice(i, i + 50).map((s: any) => ({
      sql: "INSERT OR REPLACE INTO Skill VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      args: [s.id, s.slug, s.name, s.description, s.fullContent, s.category, s.subcategory, s.tags, s.tier, s.author, s.version, s.sourcePath, s.sourceType, s.parentGroup, s.isIndexed ? 1 : 0, s.createdAt?.toISOString?.() || new Date().toISOString(), s.updatedAt?.toISOString?.() || new Date().toISOString()],
    }));
    try {
      await turso.batch(batch);
      console.log(`  ${existing + i + 1}/${existing + skills.length}`);
    } catch (e: any) {
      console.error(`Batch failed at ${i}: ${e.message}, retrying individually...`);
      for (const stmt of batch) {
        try { await turso.execute(stmt); } catch { /* skip dupes */ }
      }
    }
  }

  // Migrate articles
  const articles = await (local as any).article.findMany();
  if (articles.length > 0) {
    const aBatch = articles.map((a: any) => ({
      sql: "INSERT OR REPLACE INTO Article VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      args: [a.id, a.slug, a.title, a.description, a.content, a.excerpt, a.coverImage, a.category, a.tags, a.author, a.relatedSkills, a.isPublished ? 1 : 0, a.publishedAt?.toISOString?.() || null, a.createdAt?.toISOString?.() || new Date().toISOString(), a.updatedAt?.toISOString?.() || new Date().toISOString()],
    }));
    await turso.batch(aBatch);
    console.log(`Migrated ${articles.length} articles`);
  }

  await local.$disconnect();
  console.log("Done!");
}

migrate().catch(e => { console.error(e.message); process.exit(1); });
