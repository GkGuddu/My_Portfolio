import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import request from 'supertest'
import { createApp } from './app.js'
import { readConfig, normalizeBasePath, parseOrigins } from './config.js'

const validContact = {
  name: '  Ada Lovelace  ',
  email: '  Ada@Example.com  ',
  subject: '  Portfolio collaboration  ',
  message: '  I would love to work together on a new project.  ',
  website: '',
}

function fixture(options = {}) {
  const saved = []
  const errors = []
  const app = createApp({
    isDatabaseReady: () => true,
    saveContact: async contact => { saved.push(contact) },
    logger: { error: message => errors.push(message) },
    ...options,
  })
  return { app, saved, errors }
}

test('contact persists only validated fields and normalizes surrounding whitespace', async () => {
  const { app, saved } = fixture()
  const response = await request(app).post('/api/contact').send({ ...validContact, admin: true })
  assert.equal(response.status, 201)
  assert.deepEqual(response.body, { message: 'Your message has been sent.' })
  assert.deepEqual(saved, [{
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    subject: 'Portfolio collaboration',
    message: 'I would love to work together on a new project.',
  }])
  assert.equal(response.headers['cache-control'], 'no-store')
  assert.equal(response.headers['x-powered-by'], undefined)
})

test('subject can be omitted', async () => {
  const { app, saved } = fixture()
  const response = await request(app).post('/api/contact').send({
    name: validContact.name, email: validContact.email, message: validContact.message,
  })
  assert.equal(response.status, 201)
  assert.equal(saved[0].subject, '')
})

test('invalid types, email syntax and length boundaries never reach persistence', async t => {
  const cases = [
    ['name', ' '], ['name', 'x'], ['name', 'x'.repeat(81)], ['name', { $ne: null }],
    ['email', 'not-an-email'], ['email', 'a'.repeat(250) + '@example.com'], ['email', ['a@example.com']],
    ['subject', 'x'.repeat(121)], ['subject', 42], ['subject', null],
    ['message', 'short'], ['message', 'x'.repeat(5001)], ['message', null],
    ['website', 'https://spam.example'], ['website', true],
  ]
  for (const [field, value] of cases) {
    await t.test(`${field}: ${JSON.stringify(value).slice(0, 40)}`, async () => {
      const { app, saved } = fixture()
      const response = await request(app).post('/api/contact').send({ ...validContact, [field]: value })
      assert.equal(response.status, 400)
      assert.ok(response.body.fields[field === 'website' ? 'form' : field])
      assert.equal(saved.length, 0)
    })
  }
})

test('minimum and maximum accepted field lengths remain usable', async () => {
  const { app, saved } = fixture()
  const response = await request(app).post('/api/contact').send({
    name: 'Ab', email: 'a@b.co', subject: 'x'.repeat(120), message: 'x'.repeat(5000),
  })
  assert.equal(response.status, 201)
  assert.equal(saved[0].message.length, 5000)
})

test('health reports connection readiness and unavailable contacts return 503', async () => {
  let ready = false
  const { app, saved } = fixture({ isDatabaseReady: () => ready })
  const health = await request(app).get('/api/health')
  assert.equal(health.status, 503)
  assert.deepEqual(health.body, { status: 'unavailable', database: 'disconnected' })
  assert.equal((await request(app).post('/api/contact').send(validContact)).status, 503)
  assert.equal(saved.length, 0)
  ready = true
  const recovered = await request(app).get('/api/health')
  assert.equal(recovered.status, 200)
  assert.deepEqual(recovered.body, { status: 'ready', database: 'connected' })
})

test('admin dashboard requires the configured token and can manage messages', async () => {
  const stored = [{ _id: '507f1f77bcf86cd799439011', name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Hello', message: 'A message', createdAt: '2026-01-01T00:00:00.000Z' }]
  let deletedId = ''
  const app = createApp({
    adminToken: 'test-admin-token',
    isDatabaseReady: () => true,
    listContacts: async () => stored,
    deleteContact: async id => { deletedId = id; return stored[0] },
  })
  assert.equal((await request(app).post('/api/admin/session').send({ token: 'wrong-token' })).status, 401)
  assert.equal((await request(app).get('/api/admin/messages')).status, 401)
  assert.deepEqual((await request(app).post('/api/admin/session').send({ token: 'test-admin-token' })).body, { authenticated: true })
  const messages = await request(app).get('/api/admin/messages').set('Authorization', 'Bearer test-admin-token')
  assert.equal(messages.status, 200)
  assert.deepEqual(messages.body.messages, stored)
  assert.equal((await request(app).delete('/api/admin/messages/not-an-id').set('Authorization', 'Bearer test-admin-token')).status, 400)
  assert.equal((await request(app).delete('/api/admin/messages/507f1f77bcf86cd799439011').set('Authorization', 'Bearer test-admin-token')).status, 204)
  assert.equal(deletedId, '507f1f77bcf86cd799439011')
})

test('admin dashboard accepts the configured ID and password', async () => {
  const app = createApp({
    adminEmail: 'gkgudd@73gmail.com',
    adminPassword: 'Gkgudd73',
    isDatabaseReady: () => true,
    listContacts: async () => [],
  })
  assert.equal((await request(app).post('/api/admin/session').send({ email: 'gkgudd@73gmail.com', password: 'wrong' })).status, 401)
  const login = await request(app).post('/api/admin/session').send({ email: 'gkgudd@73gmail.com', password: 'Gkgudd73' })
  assert.equal(login.status, 200)
  assert.equal(login.body.authenticated, true)
  assert.equal(typeof login.body.token, 'string')
  assert.equal((await request(app).get('/api/admin/messages').set('Authorization', `Bearer ${login.body.token}`)).status, 200)
})

test('admin can save validated portfolio content and public clients can read it', async () => {
  let savedContent = null
  const content = {
    resumeUrl: '/Resume.pdf',
    skills: [{ name: 'Frontend', tone: 'pink', description: 'Interfaces.', skills: [{ name: 'React.js' }] }],
    projects: [{ title: 'Demo', description: 'A demo project.', image: '/demo.png', techStack: ['React'], link: null, github: null }],
    education: [{ id: 'btech', degree: 'B.Tech', field: 'CSE', institution: 'University', start: { label: '2022', value: '2022' }, end: { label: '2026', value: '2026' }, cgpa: '7.5', level: 'Undergraduate' }],
  }
  const app = createApp({
    adminToken: 'test-admin-token',
    isDatabaseReady: () => true,
    loadContent: async () => savedContent,
    saveContent: async value => { savedContent = value; return value },
  })
  assert.deepEqual((await request(app).get('/api/content')).body, { content: null })
  const response = await request(app).put('/api/admin/content').set('Authorization', 'Bearer test-admin-token').send(content)
  assert.equal(response.status, 200)
  assert.deepEqual((await request(app).get('/api/content')).body, { content })
  assert.equal((await request(app).put('/api/admin/content').set('Authorization', 'Bearer test-admin-token').send({ ...content, projects: [] })).status, 200)
})

test('a failed write returns failure without exposing database details', async () => {
  const { app, errors } = fixture({ saveContact: async () => { throw new Error('mongodb://secret:credential@internal') } })
  const response = await request(app).post('/api/contact').send(validContact)
  assert.equal(response.status, 503)
  assert.match(response.body.error, /temporarily unavailable/)
  assert.doesNotMatch(JSON.stringify(response.body), /secret|credential|internal/)
  assert.deepEqual(errors, ['Contact message could not be saved.'])
})

test('malformed, oversized and unsupported request bodies produce JSON errors', async () => {
  const { app, saved } = fixture()
  const malformed = await request(app).post('/api/contact').set('Content-Type', 'application/json').send('{broken')
  assert.equal(malformed.status, 400)
  assert.match(malformed.body.error, /valid JSON/)
  const oversized = await request(app).post('/api/contact').send({ message: 'x'.repeat(40000) })
  assert.equal(oversized.status, 413)
  const unsupported = await request(app).post('/api/contact').type('form').send(validContact)
  assert.equal(unsupported.status, 415)
  const array = await request(app).post('/api/contact').send([validContact])
  assert.equal(array.status, 400)
  assert.equal(saved.length, 0)
})

test('CORS accepts configured and same origins and rejects unknown origins before saving', async () => {
  const { app, saved } = fixture({ clientOrigins: ['https://portfolio.example'] })
  const accepted = await request(app).post('/api/contact').set('Origin', 'https://portfolio.example').send(validContact)
  assert.equal(accepted.status, 201)
  assert.equal(accepted.headers['access-control-allow-origin'], 'https://portfolio.example')
  const sameOrigin = await request(app).post('/api/contact')
    .set('Host', 'portfolio.example').set('Origin', 'http://portfolio.example').send(validContact)
  assert.equal(sameOrigin.status, 201)
  const rejected = await request(app).post('/api/contact').set('Origin', 'https://unknown.example').send(validContact)
  assert.equal(rejected.status, 403)
  assert.equal(rejected.headers['access-control-allow-origin'], undefined)
  const preflight = await request(app).options('/api/contact')
    .set('Origin', 'https://portfolio.example').set('Access-Control-Request-Method', 'POST')
  assert.equal(preflight.status, 204)
  assert.equal(saved.length, 2)
})

test('rate limit applies to both contact aliases and preserves the JSON API contract', async () => {
  const { app, saved } = fixture({ contactRateLimit: 2, basePath: '/My_Portfolio/' })
  assert.equal((await request(app).post('/api/contact').send(validContact)).status, 201)
  assert.equal((await request(app).post('/My_Portfolio/api/contact').send(validContact)).status, 201)
  const blocked = await request(app).post('/api/contact').send(validContact)
  assert.equal(blocked.status, 429)
  assert.match(blocked.body.error, /Too many messages/)
  assert.ok(blocked.headers['retry-after'])
  assert.equal(saved.length, 2)
})

const temporaryDirectories = []
after(async () => {
  for (const directory of temporaryDirectories) {
    await unlink(join(directory, 'index.html'))
    await rmdir(directory)
  }
})

test('production serves the SPA under its base path and keeps API/missing assets as 404', async () => {
  const distPath = await mkdtemp(join(tmpdir(), 'portfolio-server-test-'))
  temporaryDirectories.push(distPath)
  await writeFile(join(distPath, 'index.html'), '<!doctype html><title>Portfolio fixture</title>')
  const { app } = fixture({ production: true, distPath, basePath: '/My_Portfolio/' })
  const page = await request(app).get('/My_Portfolio/projects').accept('html')
  assert.equal(page.status, 200)
  assert.match(page.text, /Portfolio fixture/)
  const api404 = await request(app).get('/My_Portfolio/api/missing').accept('html')
  assert.equal(api404.status, 404)
  assert.deepEqual(api404.body, { error: 'API endpoint not found.' })
  assert.equal((await request(app).get('/api/missing')).status, 404)
  assert.equal((await request(app).get('/My_Portfolio/assets/missing.js')).status, 404)
  assert.equal((await request(app).get('/outside-base').accept('html')).status, 404)
})

test('configuration validates required database settings, origins, proxy hops and base path', () => {
  assert.throws(() => readConfig({}), /MONGODB_URI is required/)
  assert.throws(() => readConfig({ MONGODB_URI: 'https://example.com' }), /MongoDB connection URI/)
  assert.throws(() => readConfig({ MONGODB_URI: 'mongodb://localhost/test', PORT: '0' }), /PORT/)
  assert.throws(() => readConfig({ MONGODB_URI: 'mongodb://localhost/test', TRUST_PROXY: 'true' }), /TRUST_PROXY/)
  assert.throws(() => parseOrigins('https://example.com/path'), /CLIENT_ORIGIN/)
  assert.throws(() => normalizeBasePath('https://example.com'), /BASE_PATH/)
  const config = readConfig({
    MONGODB_URI: 'mongodb://localhost/test', ADMIN_TOKEN: 'test-admin-token', CLIENT_ORIGIN: 'https://example.com/, http://localhost:5173',
    BASE_PATH: '/My_Portfolio/', TRUST_PROXY: '1', NODE_ENV: 'production',
  })
  assert.deepEqual(config.clientOrigins, ['https://example.com', 'http://localhost:5173'])
  assert.equal(config.basePath, '/My_Portfolio')
  assert.equal(config.port, 3001)
  assert.equal(config.adminToken, 'test-admin-token')
  assert.equal(config.trustProxy, 1)
  assert.equal(config.production, true)
})
