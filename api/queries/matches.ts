import { getDb } from "./connection";
import { matches } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findAllMatches(status?: string) {
  const db = getDb();
  if (status) {
    return db.select().from(matches).where(eq(matches.status, status as "ongoing" | "upcoming" | "finished")).orderBy(desc(matches.scheduledAt));
  }
  return db.select().from(matches).orderBy(desc(matches.scheduledAt));
}

export async function findMatchById(id: number) {
  const db = getDb();
  return db.select().from(matches).where(eq(matches.id, id)).then(rows => rows[0] || null);
}

export async function findOngoingMatches() {
  const db = getDb();
  return db.select().from(matches).where(eq(matches.status, "ongoing")).orderBy(desc(matches.scheduledAt));
}

export async function findUpcomingMatches() {
  const db = getDb();
  return db.select().from(matches).where(eq(matches.status, "upcoming")).orderBy(matches.scheduledAt);
}

export async function findRecentMatches(limit = 20) {
  const db = getDb();
  return db.select().from(matches)
    .where(eq(matches.status, "finished"))
    .orderBy(desc(matches.finishedAt))
    .limit(limit);
}

export async function createMatch(data: {
  teamAId: number;
  teamBId: number;
  teamAScore?: number;
  teamBScore?: number;
  status?: "ongoing" | "upcoming" | "finished";
  matchType?: string;
  scheduledAt?: Date;
  mapName?: string;
  eventName?: string;
}) {
  const db = getDb();
  const [result] = await db.insert(matches).values(data).$returningId();
  return findMatchById(result.id);
}

export async function updateMatch(id: number, data: Partial<typeof matches.$inferInsert>) {
  const db = getDb();
  await db.update(matches).set(data).where(eq(matches.id, id));
  return findMatchById(id);
}

export async function deleteMatch(id: number) {
  const db = getDb();
  await db.delete(matches).where(eq(matches.id, id));
}
