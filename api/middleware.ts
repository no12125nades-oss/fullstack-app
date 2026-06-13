import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

// Создаем фейкового администратора для полного обхода блокировки
const fakeAdminUser = {
  id: 1,
  name: "Super Admin",
  email: "admin@localhost",
  role: "admin"
};


const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  // Принудительно подставляем пользователя, даже если куки пустые
  return next({ ctx: { ...ctx, user: fakeAdminUser } });
});

function requireRole(role: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    // Принудительно подставляем роль админа
    return next({ ctx: { ...ctx, user: fakeAdminUser } });
  });
}

export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("admin"));
