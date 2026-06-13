import { getDb } from "./connection";
import { rankings, teams } from "@db/schema";
import { eq, and, asc, desc } from "drizzle-orm";

export async function findRankingsByWeek(week: number, year: number) {
  const db = getDb();
  return db.select({
    id: rankings.id,
    teamId: rankings.teamId,
    position: rankings.position,
    points: rankings.points,
    trend: rankings.trend,
    week: rankings.week,
    year: rankings.year,
    teamName: teams.name,
    teamLogo: teams.logo,
    teamRegion: teams.region,
  })
  .from(rankings)
  .innerJoin(teams, eq(rankings.teamId, teams.id))
  .where(and(eq(rankings.week, week), eq(rankings.year, year)))
  .orderBy(asc(rankings.position));
}

export async function findCurrentWeekRankings() {
  // Get the most recent week
  const db = getDb();
  const latest = await db.select().from(rankings).orderBy(desc(rankings.week), desc(rankings.year)).limit(1);
  if (!latest.length) return [];
  return findRankingsByWeek(latest[0].week, latest[0].year);
}

export async function createRanking(data: {
  teamId: number;
  position: number;
  points?: number;
  trend?: string;
  week: number;
  year: number;
}) {
  const db = getDb();
  const [result] = await db.insert(rankings).values(data).$returningId();
  return db.select().from(rankings).where(eq(rankings.id, result.id)).then(rows => rows[0]);
}

export async function updateRanking(id: number, data: Partial<typeof rankings.$inferInsert>) {
  const db = getDb();
  await db.update(rankings).set(data).where(eq(rankings.id, id));
  return db.select().from(rankings).where(eq(rankings.id, id)).then(rows => rows[0]);
}

export async function deleteRanking(id: number) {
  const db = getDb();
  await db.delete(rankings).where(eq(rankings.id, id));
}


