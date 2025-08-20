// app/api/route.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import accounts from './accounts';
import clientes from './clientes';
import seed from './seed';
import auth, { requireAuth } from './auth';

export const runtime = 'nodejs' // importante (no 'node')

// Base Hono
const app = new Hono().basePath('/api')

app.use('/clientes/*', requireAuth);

const routes = app
    .route('/accounts', accounts)
    .route('/clientes', clientes)
    .route('/auth', auth)
    .route('/seed', seed);


// // Rutas públicas
// app.route('/auth', auth)
// app.route('/seed', seed)

// // Proteger /accounts con cookie JWT
// app.use('/accounts/*', requireAuth)
// app.route('/accounts', accounts)

// app.use('/clientes/*', requireAuth)
// app.route('/clientes', clientes)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
