import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import {
  createTeam,
  updateTeam,
  deleteTeam,
} from "./queries/teams";
import {
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "./queries/players";
import {
  createMatch,
  updateMatch,
  deleteMatch,
} from "./queries/matches";
import {
  createRanking,
  updateRanking,
  deleteRanking,
} from "./queries/rankings";

export const adminRouter = createRouter({
  // Team management
  teamCreate: adminQuery
    .input(z.object({
      name: z.string().min(1).max(100),
      logo: z.string().optional(),
      region: z.string().min(1),
      description: z.string().optional(),
      valveRanking: z.number().optional(),
      worldRanking: z.number().optional(),
      weeksInTop30: z.number().optional(),
      averagePlayerAge: z.number().optional(),
      coachName: z.string().optional(),
      coachFlag: z.string().optional(),
      coachRealName: z.string().optional(),
      points: z.number().optional(),
      trend: z.string().optional(),
    }))
    .mutation(({ input }) => {
      return createTeam({
        ...input,
        averagePlayerAge: input.averagePlayerAge !== undefined ? String(input.averagePlayerAge) : undefined,
      });
    }),

  teamUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(100).optional(),
      logo: z.string().optional(),
      region: z.string().optional(),
      description: z.string().optional(),
      valveRanking: z.number().optional(),
      worldRanking: z.number().optional(),
      weeksInTop30: z.number().optional(),
      averagePlayerAge: z.number().optional(),
      coachName: z.string().optional(),
      coachFlag: z.string().optional(),
      coachRealName: z.string().optional(),
      points: z.number().optional(),
      trend: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const values: Record<string, unknown> = { ...data };
      if (data.averagePlayerAge !== undefined) {
        values.averagePlayerAge = String(data.averagePlayerAge);
      }
      return updateTeam(id, values as Parameters<typeof updateTeam>[1]);
    }),

  teamDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteTeam(input.id)),

  // Player management
  playerCreate: adminQuery
    .input(z.object({
      teamId: z.number(),
      gameName: z.string().min(1),
      realName: z.string().optional(),
      photo: z.string().optional(),
      flag: z.string().optional(),
      role: z.string().optional(),
      age: z.number().optional(),
      rating: z.number().optional(),
      kpr: z.number().optional(),
      dpr: z.number().optional(),
      adr: z.number().optional(),
      kast: z.number().optional(),
      mapsPlayed: z.number().optional(),
    }))
    .mutation(({ input }) => {
      return createPlayer({
        ...input,
        rating: input.rating !== undefined ? String(input.rating) : undefined,
        kpr: input.kpr !== undefined ? String(input.kpr) : undefined,
        dpr: input.dpr !== undefined ? String(input.dpr) : undefined,
        adr: input.adr !== undefined ? String(input.adr) : undefined,
        kast: input.kast !== undefined ? String(input.kast) : undefined,
      });
    }),

  playerUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      teamId: z.number().optional(),
      gameName: z.string().optional(),
      realName: z.string().optional(),
      photo: z.string().optional(),
      flag: z.string().optional(),
      role: z.string().optional(),
      age: z.number().optional(),
      rating: z.number().optional(),
      kpr: z.number().optional(),
      dpr: z.number().optional(),
      adr: z.number().optional(),
      kast: z.number().optional(),
      mapsPlayed: z.number().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const values: Record<string, unknown> = { ...data };
      if (data.rating !== undefined) values.rating = String(data.rating);
      if (data.kpr !== undefined) values.kpr = String(data.kpr);
      if (data.dpr !== undefined) values.dpr = String(data.dpr);
      if (data.adr !== undefined) values.adr = String(data.adr);
      if (data.kast !== undefined) values.kast = String(data.kast);
      return updatePlayer(id, values as Parameters<typeof updatePlayer>[1]);
    }),

  playerDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deletePlayer(input.id)),

  // Match management
  matchCreate: adminQuery
    .input(z.object({
      teamAId: z.number(),
      teamBId: z.number(),
      teamAScore: z.number().optional(),
      teamBScore: z.number().optional(),
      status: z.enum(["ongoing", "upcoming", "finished"]).optional(),
      matchType: z.string().optional(),
      scheduledAt: z.string().optional(),
      mapName: z.string().optional(),
      eventName: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const data = {
        ...input,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      };
      return createMatch(data);
    }),

  matchUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      teamAId: z.number().optional(),
      teamBId: z.number().optional(),
      teamAScore: z.number().optional(),
      teamBScore: z.number().optional(),
      status: z.enum(["ongoing", "upcoming", "finished"]).optional(),
      matchType: z.string().optional(),
      scheduledAt: z.string().optional(),
      mapName: z.string().optional(),
      eventName: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...rest } = input;
      const data = {
        ...rest,
        scheduledAt: rest.scheduledAt ? new Date(rest.scheduledAt) : undefined,
      };
      return updateMatch(id, data);
    }),

  matchDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteMatch(input.id)),

  // Ranking management
  rankingCreate: adminQuery
    .input(z.object({
      teamId: z.number(),
      position: z.number(),
      points: z.number().optional(),
      trend: z.string().optional(),
      week: z.number(),
      year: z.number(),
    }))
    .mutation(({ input }) => createRanking(input)),

  rankingUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      teamId: z.number().optional(),
      position: z.number().optional(),
      points: z.number().optional(),
      trend: z.string().optional(),
      week: z.number().optional(),
      year: z.number().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateRanking(id, data);
    }),

  rankingDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteRanking(input.id)),
});
