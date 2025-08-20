import { z } from "zod";
import { Hono, MiddlewareHandler } from "hono";
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// import db from '@/lib/db';
import { zValidator } from '@hono/zod-validator';
import { LoginSchema } from "@/features/auth/schema";

import { Agent } from 'undici'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

const BACKEND = process.env.BACKEND_URL! // ej: https://localhost:7182
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'token' // por defecto 'token'
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN // opcional
const IS_PROD = process.env.NODE_ENV === 'production'

const devInsecureAgent =
  process.env.NODE_ENV !== 'production'
    ? new Agent({ connect: { rejectUnauthorized: false } })
    : undefined

const app = new Hono()
    // LISTA
    .post(
        "/login", 
        zValidator('json', LoginSchema),
        async (c) => {
            const { email, password } = c.req.valid('json');
            console.log('email', email);
            console.log('password', password);

            const upstream = await fetch(`${BACKEND}/auth/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
                dispatcher: devInsecureAgent, // solo en dev
            })

            if (!upstream.ok) {
                let err: any = null
                try { err = await upstream.json() } catch {}
                return c.json(
                    { error: err?.error ?? 'Login failed', status: upstream.status },
                    upstream.status ? 500 : 502
                )
            }
            
            console.log('upstream', upstream);

            const data = await upstream.json() as any

            console.log('data', data);

            const token = data.token ?? data.accessToken ?? data.jwt ?? data.id_token
        
            if (!token) return c.json({ error: 'Missing token from backend' }, 502)
            
            setCookie(c, COOKIE_NAME, token, {
                httpOnly: true,
                secure: IS_PROD,          // en dev con http puede ser false
                sameSite: 'lax',
                path: '/',
                domain: COOKIE_DOMAIN,    // si usás subdominios
                maxAge: 60 * 60 * 24 * 7, // 7 días
            })
        
            return c.json({ ...data ?? null })
    });

export const requireAuth: MiddlewareHandler = async (c, next) => {
    const token = getCookie(c, COOKIE_NAME)
    if (!token) return c.json({ error: 'unauthorized' }, 401)
    c.set('token', token) // podrás leerlo con c.get('token') en tus rutas
    await next()
}

export default app;