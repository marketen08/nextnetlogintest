import { z } from "zod";
import { Hono } from "hono";
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// import db from '@/lib/db';
import { zValidator } from '@hono/zod-validator';
import { AccountSchema } from "@/features/accounts/schema";

const app = new Hono()
    // LISTA
    .get(
        "/", 
        // clerkMiddleware(),
        async (c) => {

            // const auth = getAuth(c);

            // if (!auth?.userId){
            //     return c.json({ error: "unauthorized" }, 401);
            // }

            // const data = await db.account.findMany({
            //     select: {
            //         id: true,
            //         name: true,
            //     },
            //     where: {
            //         userId: auth.userId
            //     }
            // });

            return c.json({ data: 'Lista de cuentas' });
    });

export default app;