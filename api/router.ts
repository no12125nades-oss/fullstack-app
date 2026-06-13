import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { teamRouter } from "./teamRouter";
import { playerRouter } from "./playerRouter";
import { matchRouter } from "./matchRouter";
import { rankingRouter } from "./rankingRouter";
import { adminRouter } from "./adminRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  team: teamRouter,
  player: playerRouter,
  match: matchRouter,
  ranking: rankingRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
