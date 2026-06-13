import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllMatches,
  findMatchById,
  findOngoingMatches,
  findUpcomingMatches,
  findRecentMatches,
} from "./queries/matches";
import { getDb } from "./queries/connection";
import { teams } from "@db/schema";
import { eq } from "drizzle-orm";

export const matchRouter = createRouter({
  list: publicQuery
    .input(z.object({ status: z.string().optional() }).optional())
    .query(({ input }) => {
      return findAllMatches(input?.status);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const match = await findMatchById(input.id);
      if (!match) return null;
      const db = getDb();
      const teamA = await db.select().from(teams).where(eq(teams.id, match.teamAId)).then(rows => rows[0] || null);
      const teamB = await db.select().from(teams).where(eq(teams.id, match.teamBId)).then(rows => rows[0] || null);
      return { ...match, teamA, teamB };
    }),

  getOngoing: publicQuery.query(() => {
    return findOngoingMatches();
  }),

  getUpcoming: publicQuery.query(() => {
    return findUpcomingMatches();
  }),

  getRecent: publicQuery.query(() => {
    return findRecentMatches();
  }),
});
