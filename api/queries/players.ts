import { getDb } from "./connection";
import { players } from "@db/schema";
import { eq } from "drizzle-orm";

export async function findAllPlayers() {
  const db = getDb();
  return db.select().from(players);
}

export async function findPlayerById(id: number) {
  const db = getDb();
  return db.select().from(players).where(eq(players.id, id)).then(rows => rows[0] || null);
}

export async function findPlayersByTeam(teamId: number) {
  const db = getDb();
  return db.select().from(players).where(eq(players.teamId, teamId));
}

export async function createPlayer(data: {
  teamId: number;
  gameName: string;
  realName?: string;
  photo?: string;
  flag?: string;
  role?: string;
  age?: number;
  rating?: string;
  kpr?: string;
  dpr?: string;
  adr?: string;
  kast?: string;
  mapsPlayed?: number;
}) {
  const db = getDb();
  const [result] = await db.insert(players).values(data).$returningId();
  return findPlayerById(result.id);
}

export async function updatePlayer(id: number, data: Partial<typeof players.$inferInsert>) {
  const db = getDb();
  await db.update(players).set(data).where(eq(players.id, id));
  return findPlayerById(id);
}

export async function deletePlayer(id: number) {
  const db = getDb();
  await db.delete(players).where(eq(players.id, id));
}
