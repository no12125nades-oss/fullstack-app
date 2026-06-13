import { relations } from "drizzle-orm";
import { users, teams, players, matches, rankings } from "./schema";

export const usersRelations = relations(users, () => ({}));

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
  matchesAsTeamA: many(matches, { relationName: "teamA" }),
  matchesAsTeamB: many(matches, { relationName: "teamB" }),
  rankings: many(rankings),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  teamA: one(teams, {
    fields: [matches.teamAId],
    references: [teams.id],
    relationName: "teamA",
  }),
  teamB: one(teams, {
    fields: [matches.teamBId],
    references: [teams.id],
    relationName: "teamB",
  }),
}));

export const rankingsRelations = relations(rankings, ({ one }) => ({
  team: one(teams, {
    fields: [rankings.teamId],
    references: [teams.id],
  }),
}));
