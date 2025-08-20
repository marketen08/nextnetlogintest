// app/api/_auth.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { MiddlewareHandler } from 'hono'

const BACKEND = process.env.BACKEND_URL! // ej: https://localhost:7182
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'auth'
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN // opcional
const IS_PROD = process.env.NODE_ENV === 'production'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const auth = new Hono()
  // POST /api/auth/login
  .post('/login', zValidator('json', LoginSchema), async (c) => {
    const { email, password } = c.req.valid('json')

    const upstream = await fetch(`${BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!upstream.ok) {
      let err: any = null
      try { err = await upstream.json() } catch {}
      return c.json(
        { error: err?.error ?? 'Login failed', status: upstream.status },
        upstream.status ? 500 : 502
      )
    }

    // Ajustá estos campos a la respuesta real de tu .NET
    const data = await upstream.json() as any
    const token =
      data.token ?? data.accessToken ?? data.jwt ?? data.id_token

    if (!token) return c.json({ error: 'Missing token from backend' }, 502)

    setCookie(c, COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,          // en dev con http puede ser false
      sameSite: 'lax',
      path: '/',
      domain: COOKIE_DOMAIN,    // si usás subdominios
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return c.json({ user: data.user ?? null })
  })

  // GET /api/auth/me  -> consulta a .NET usando el token de la cookie
  .get('/me', async (c) => {
    const token = getCookie(c, COOKIE_NAME)
    if (!token) return c.json({ error: 'unauthorized' }, 401)

    const res = await fetch(`${BACKEND}/api/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
    })
    const body = await res.json().catch(() => ({}))
    return c.json(body, res.status)
  })

  // POST /api/auth/logout -> borra cookie
  .post('/logout', async (c) => {
    deleteCookie(c, COOKIE_NAME, { path: '/', domain: COOKIE_DOMAIN })
    return c.json({ ok: true })
  })

// Middleware para proteger rutas y pasar el token a handlers
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, COOKIE_NAME)
  if (!token) return c.json({ error: 'unauthorized' }, 401)
  c.set('token', token) // podrás leerlo con c.get('token') en tus rutas
  await next()
}

export default auth
