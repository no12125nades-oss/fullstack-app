import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Teams table
export const teams = mysqlTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  logo: text("logo"),
  region: varchar("region", { length: 50 }).notNull(),
  description: text("description"),
  valveRanking: int("valve_ranking").default(0),
  worldRanking: int("world_ranking").default(0),
  weeksInTop30: int("weeks_in_top30").default(0),
  averagePlayerAge: decimal("average_player_age", { precision: 4, scale: 1 }).default("0"),
  coachName: varchar("coach_name", { length: 100 }),
  coachFlag: varchar("coach_flag", { length: 10 }),
  coachRealName: varchar("coach_real_name", { length: 100 }),
  points: int("points").default(0),
  trend: varchar("trend", { length: 10 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

// Players table
export const players = mysqlTable("players", {
  id: serial("id").primaryKey(),
  teamId: bigint("team_id", { mode: "number", unsigned: true }).notNull(),
  gameName: varchar("game_name", { length: 100 }).notNull(),
  realName: varchar("real_name", { length: 100 }),
  photo: text("photo"),
  flag: varchar("flag", { length: 10 }),
  role: varchar("role", { length: 50 }),
  age: int("age"),
  rating: decimal("rating", { precision: 4, scale: 2 }).default("0"),
  kpr: decimal("kpr", { precision: 4, scale: 2 }).default("0"),
  dpr: decimal("dpr", { precision: 4, scale: 2 }).default("0"),
  adr: decimal("adr", { precision: 5, scale: 1 }).default("0"),
  kast: decimal("kast", { precision: 5, scale: 1 }).default("0"),
  mapsPlayed: int("maps_played").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

// Matches table
export const matches = mysqlTable("matches", {
  id: serial("id").primaryKey(),
  teamAId: bigint("team_a_id", { mode: "number", unsigned: true }).notNull(),
  teamBId: bigint("team_b_id", { mode: "number", unsigned: true }).notNull(),
  teamAScore: int("team_a_score").default(0),
  teamBScore: int("team_b_score").default(0),
  status: mysqlEnum("status", ["ongoing", "upcoming", "finished"]).default("upcoming").notNull(),
  matchType: varchar("match_type", { length: 50 }),
  scheduledAt: timestamp("scheduled_at"),
  finishedAt: timestamp("finished_at"),
  mapName: varchar("map_name", { length: 100 }),
  eventName: varchar("event_name", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// Rankings table
export const rankings = mysqlTable("rankings", {
  id: serial("id").primaryKey(),
  teamId: bigint("team_id", { mode: "number", unsigned: true }).notNull(),
  position: int("position").notNull(),
  points: int("points").default(0),
  trend: varchar("trend", { length: 10 }).default("0"),
  week: int("week").notNull(),
  year: int("year").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Ranking = typeof rankings.$inferSelect;
export type InsertRanking = typeof rankings.$inferInsert;
