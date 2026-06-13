import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findRankingsByWeek,
  findCurrentWeekRankings,
} from "./queries/rankings";

export const rankingRouter = createRouter({
  list: publicQuery
    .input(z.object({ week: z.number().optional(), year: z.number().optional() }).optional())
    .query(async ({ input }) => {
      if (input?.week && input?.year) {
        return findRankingsByWeek(input.week, input.year);
      }
      return findCurrentWeekRankings();
    }),

  currentWeek: publicQuery.query(() => {
    return findCurrentWeekRankings();
  }),
});
