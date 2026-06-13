import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllTeams,
  findTeamById,
  findTeamByName,
} from "./queries/teams";
import { findPlayersByTeam } from "./queries/players";
import { getDb } from "./queries/connection";
import { matches } from "@db/schema";
import { eq, or, desc } from "drizzle-orm";

export const teamRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        search: z.string().optional(),
        region: z.string().optional(),
      }).optional()
    )
    .query(({ input }) => {
      return findAllTeams(input?.search, input?.region);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const team = await findTeamById(input.id);
      if (!team) return null;
      const players = await findPlayersByTeam(input.id);
      return { ...team, players };
    }),

  getByName: publicQuery
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return findTeamByName(input.name);
    }),

  getMatches: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(matches)
        .where(or(eq(matches.teamAId, input.id), eq(matches.teamBId, input.id)))
        .orderBy(desc(matches.scheduledAt));
    }),
});
