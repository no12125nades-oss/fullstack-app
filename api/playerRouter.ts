import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllPlayers,
  findPlayerById,
  findPlayersByTeam,
} from "./queries/players";
import { getDb } from "./queries/connection";
import { teams } from "@db/schema";
import { eq } from "drizzle-orm";

export const playerRouter = createRouter({
  list: publicQuery.query(() => {
    return findAllPlayers();
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const player = await findPlayerById(input.id);
      if (!player) return null;
      const db = getDb();
      const team = await db.select().from(teams).where(eq(teams.id, player.teamId)).then(rows => rows[0] || null);
      return { ...player, team };
    }),

  getByTeam: publicQuery
    .input(z.object({ teamId: z.number() }))
    .query(({ input }) => {
      return findPlayersByTeam(input.teamId);
    }),
});
