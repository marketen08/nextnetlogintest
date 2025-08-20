import { z } from "zod";
import { Hono } from "hono";
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// import db from '@/lib/db';
import { zValidator } from '@hono/zod-validator';
import { tipoCliProSchema } from "@/features/clientes/schema";

import { Agent } from 'undici'
import { getCookie } from "hono/cookie";

const BACKEND = process.env.BACKEND_URL! // ej: https://localhost:7182

const devInsecureAgent =
  process.env.NODE_ENV !== 'production'
    ? new Agent({ connect: { rejectUnauthorized: false } })
    : undefined

const app = new Hono()
    // LISTA
    .get(
        "/", 
        zValidator('query', z.object({
            tipo: tipoCliProSchema,
        })),
        async (c) => {
            const { tipo } = c.req.valid("query")
            const token = getCookie(c, "token") || c.req.header('authorization')?.replace('Bearer ', '') || ''

            if (!token) return c.json({ message: "Unauthorized" }, 401);

            const r = await fetch(`${BACKEND}/clipro?tipo=${tipo}`, {
                headers: { authorization: `Bearer ${token}` },
                dispatcher: devInsecureAgent, // solo en dev
            });

            const respuesta = await r.json().catch(() => ({}))
        
            return c.json(respuesta)
    });

export default app;