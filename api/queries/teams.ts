import { getDb } from "./connection";
import { teams } from "@db/schema";
import { eq, like, desc, sql } from "drizzle-orm";

export async function findAllTeams(search?: string, region?: string) {
  const db = getDb();

  const conditions = [];
  if (search) {
    conditions.push(like(teams.name, `%${search}%`));
  }
  if (region) {
    conditions.push(eq(teams.region, region));
  }

  if (conditions.length > 0) {
    return db.select().from(teams).where(sql`${conditions.join(" AND ")}`).orderBy(desc(teams.points));
  }

  return db.select().from(teams).orderBy(desc(teams.points));
}

export async function findTeamById(id: number) {
  const db = getDb();
  return db.select().from(teams).where(eq(teams.id, id)).then(rows => rows[0] || null);
}

export async function findTeamByName(name: string) {
  const db = getDb();
  return db.select().from(teams).where(eq(teams.name, name)).then(rows => rows[0] || null);
}

export async function createTeam(data: {
  name: string;
  logo?: string;
  region: string;
  description?: string;
  valveRanking?: number;
  worldRanking?: number;
  weeksInTop30?: number;
  averagePlayerAge?: string;
  coachName?: string;
  coachFlag?: string;
  coachRealName?: string;
  points?: number;
  trend?: string;
}) {
  const db = getDb();
  const [result] = await db.insert(teams).values(data).$returningId();
  return findTeamById(result.id);
}

export async function updateTeam(id: number, data: Partial<typeof teams.$inferInsert>) {
  const db = getDb();
  await db.update(teams).set(data).where(eq(teams.id, id));
  return findTeamById(id);
}

export async function deleteTeam(id: number) {
  const db = getDb();
  await db.delete(teams).where(eq(teams.id, id));
}
