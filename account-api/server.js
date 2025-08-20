import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import pg from 'pg'

const PORT = process.env.PORT || 4000
const DATABASE_URL = process.env.DATABASE_URL
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

const app = Fastify({ logger: true })

await app.register(cors, { origin: true })
await app.register(helmet)
await app.register(jwt, { secret: JWT_SECRET })

// Database
const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 5 })

async function migrate() {
  // Simple schema creation if not exists
  await pool.query(`
    create table if not exists users (
      id uuid primary key,
      name text not null,
      email text unique,
      phone text unique,
      cpf text unique,
      rg text,
      income numeric,
      password_hash text not null,
      created_at timestamp default now()
    );
  `);

  await pool.query(`
    create table if not exists addresses (
      id uuid primary key,
      user_id uuid references users(id) on delete cascade,
      street text,
      cep text,
      city text,
      state text,
      created_at timestamp default now()
    );
  `);
}

// Auth utils
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
  return bcrypt.hash(password, salt)
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// Health
app.get('/health', async () => ({ status: 'OK', ts: new Date().toISOString() }))

// Auth: register
app.post('/auth/register', async (req, reply) => {
  const bodySchema = z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal('')).or(z.null()),
    phone: z.string().min(8).optional().or(z.literal('')).or(z.null()),
    cpf: z.string().min(11).max(14),
    rg: z.string().min(5),
    income: z.string().min(1).transform((val) => {
      // Remove caracteres não numéricos exceto vírgula e ponto
      const cleanIncome = val.replace(/[^\d,.]/g, '');
      // Converte vírgula para ponto
      const normalizedIncome = cleanIncome.replace(',', '.');
      return parseFloat(normalizedIncome);
    }),
    password: z.string().min(6),
    address: z.object({
      street: z.string(),
      cep: z.string(),
      city: z.string(),
      state: z.string().max(2)
    })
  }).refine(d => d.email || d.phone, { message: 'email ou phone é obrigatório' })

  const data = bodySchema.parse(req.body)

  const passwordHash = await hashPassword(data.password)

  const userId = randomUUID()
  await pool.query(
    'insert into users (id, name, email, phone, cpf, rg, income, password_hash) values ($1, $2, $3, $4, $5, $6, $7, $8)',
    [userId, data.name, data.email || null, data.phone || null, data.cpf, data.rg, data.income, passwordHash]
  )

  const addressId = randomUUID()
  await pool.query(
    'insert into addresses (id, user_id, street, cep, city, state) values ($1, $2, $3, $4, $5, $6)',
    [addressId, userId, data.address.street, data.address.cep, data.address.city, data.address.state]
  )

  return reply.code(201).send({ id: userId })
})

// Auth: login (email ou phone)
app.post('/auth/login', async (req, reply) => {
  const bodySchema = z.object({
    email: z.string().email().optional().or(z.literal('')).or(z.null()),
    phone: z.string().optional().or(z.literal('')).or(z.null()),
    password: z.string().min(6)
  }).refine(d => d.email || d.phone, { message: 'email ou phone é obrigatório' })

  const { email, phone, password } = bodySchema.parse(req.body)

  let result;
  if (email) {
    result = await pool.query('select * from users where email = $1', [email]);
  } else if (phone) {
    result = await pool.query('select * from users where phone = $1', [phone]);
  } else {
    return reply.code(400).send({ error: 'email ou phone é obrigatório' });
  }

  const user = result.rows[0]
  if (!user) return reply.code(401).send({ error: 'Credenciais inválidas' })

  const ok = await verifyPassword(password, user.password_hash)
  if (!ok) return reply.code(401).send({ error: 'Credenciais inválidas' })

  const token = app.jwt.sign({ sub: user.id })
  return { token }
})

// Middleware para rotas autenticadas
app.addHook('onRequest', async (req, reply) => {
  if (req.routerPath?.startsWith('/accounts')) {
    try { await req.jwtVerify() } catch { return reply.code(401).send({ error: 'Unauthorized' }) }
  }
})

// CRUD contas
app.get('/accounts', async (req) => {
  const result = await pool.query('select id, name, email, phone, cpf, rg, income, created_at from users order by created_at desc')
  return result.rows
})

app.get('/accounts/:id', async (req, reply) => {
  const { id } = req.params
  const result = await pool.query('select id, name, email, phone, cpf, rg, income, created_at from users where id = $1', [id])
  const user = result.rows[0]
  if (!user) return reply.code(404).send({ error: 'Not found' })
  const addr = await pool.query('select street, cep, city, state from addresses where user_id = $1', [id])
  return { ...user, address: addr.rows[0] || null }
})

app.put('/accounts/:id', async (req, reply) => {
  const { id } = req.params
  const bodySchema = z.object({
    name: z.string().min(2).optional(),
    cpf: z.string().min(11).max(14).optional(),
    rg: z.string().min(5).optional(),
    income: z.string().min(1).optional().transform((val) => {
      if (!val) return undefined;
      // Remove caracteres não numéricos exceto vírgula e ponto
      const cleanIncome = val.replace(/[^\d,.]/g, '');
      // Converte vírgula para ponto
      const normalizedIncome = cleanIncome.replace(',', '.');
      return parseFloat(normalizedIncome);
    }),
    address: z.object({
      street: z.string(),
      cep: z.string(),
      city: z.string(),
      state: z.string().max(2)
    }).optional()
  })
  const data = bodySchema.parse(req.body)

  if (Object.keys(data).length === 0) return reply.code(400).send({ error: 'Nada para atualizar' })

  if (data.name || data.cpf || data.rg || data.income) {
    await pool.query(
      'update users set name = coalesce($1, name), cpf = coalesce($2, cpf), rg = coalesce($3, rg), income = coalesce($4, income) where id = $5',
      [data.name, data.cpf, data.rg, data.income, id]
    )
  }
  if (data.address) {
    const exists = await pool.query('select 1 from addresses where user_id = $1', [id])
    if (exists.rowCount > 0) {
      await pool.query(
        'update addresses set street=$1, cep=$2, city=$3, state=$4 where user_id = $5',
        [data.address.street, data.address.cep, data.address.city, data.address.state, id]
      )
    } else {
      const addressId = randomUUID()
      await pool.query(
        'insert into addresses (id, user_id, street, cep, city, state) values ($1, $2, $3, $4, $5, $6)',
        [addressId, id, data.address.street, data.address.cep, data.address.city, data.address.state]
      )
    }
  }
  return { ok: true }
})

app.delete('/accounts/:id', async (req) => {
  const { id } = req.params
  await pool.query('delete from users where id = $1', [id])
  return { ok: true }
})

// Start
try {
  await migrate()
  await app.listen({ port: PORT, host: '0.0.0.0' })
  app.log.info(`Account API running on ${PORT}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}


