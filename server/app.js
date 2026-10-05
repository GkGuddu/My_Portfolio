import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import mongoose from 'mongoose'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ContactMessage } from './models/ContactMessage.js'
import { PortfolioContent } from './models/PortfolioContent.js'
import { ResumeFile } from './models/ResumeFile.js'
import { MAX_RESUME_BYTES, validateResume } from './resume-validation.js'
import { validatePortfolioContent } from './content-validation.js'
import { normalizeBasePath } from './config.js'
import { validateContact } from './validation.js'

const defaultDistPath = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const unavailable = 'Messaging is temporarily unavailable. Please try again later.'

export function createApp({
  saveContact = contact => ContactMessage.create(contact),
  isDatabaseReady = () => mongoose.connection.readyState === 1,
  clientOrigins = [],
  basePath = '',
  trustProxy = 0,
  production = false,
  distPath = defaultDistPath,
  contactRateLimit = 5,
  adminToken = '',
  adminEmail = '',
  adminPassword = '',
  listContacts = () => ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean(),
  deleteContact = id => ContactMessage.findByIdAndDelete(id),
  loadContent = async () => (await PortfolioContent.findOne({ key: 'portfolio' }).lean())?.data || null,
  saveContent = data => PortfolioContent.findOneAndUpdate({ key: 'portfolio' }, { key: 'portfolio', data }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean(),
  logger = console,
  saveResume = file => ResumeFile.create(file),
  loadResume = id => ResumeFile.findById(id),
} = {}) {
  const app = express()
  const prefix = normalizeBasePath(basePath)
  app.disable('x-powered-by')
  app.set('trust proxy', trustProxy)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", 'data:', 'https:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        upgradeInsecureRequests: production ? [] : null,
      },
    },
    strictTransportSecurity: production ? undefined : false,
  }))

  const api = express.Router()
  api.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    const origin = req.get('origin')
    const sameOrigin = `${req.protocol}://${req.get('host')}`
    if (origin && origin !== sameOrigin && !clientOrigins.includes(origin)) {
      return res.status(403).json({ error: 'This origin is not allowed.' })
    }
    next()
  })
  api.use(cors({
    origin: true,
    methods: ['DELETE', 'GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 600,
  }))

  api.get('/health', (_req, res) => {
    const ready = isDatabaseReady()
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'unavailable',
      database: ready ? 'connected' : 'disconnected',
    })
  })

  api.get('/content', async (_req, res) => {
    if (!isDatabaseReady()) return res.status(503).json({ error: unavailable })
    try {
      return res.status(200).json({ content: await loadContent() })
    } catch {
      logger.error('Portfolio content could not be loaded.')
      return res.status(503).json({ error: unavailable })
    }
  })

  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: contactRateLimit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many messages. Please try again in 15 minutes.' },
  })

  const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many admin login attempts. Please try again later.' },
  })

  const sessionToken = adminToken || (adminEmail && adminPassword ? randomBytes(32).toString('hex') : '')
  const adminAuthConfigured = Boolean(sessionToken)
  const isValidSecret = (receivedValue, expectedValue) => {
    if (!expectedValue || !receivedValue) return false
    const expected = Buffer.from(expectedValue)
    const received = Buffer.from(receivedValue)
    return expected.length === received.length && timingSafeEqual(expected, received)
  }
  const isValidAdminToken = token => isValidSecret(token, sessionToken)
  const isValidAdminCredentials = (email, password) => {
    if (!adminEmail || !adminPassword || typeof email !== 'string' || typeof password !== 'string') return false
    return isValidSecret(email.trim().toLowerCase(), adminEmail.toLowerCase()) && isValidSecret(password, adminPassword)
  }

  const requireAdmin = (req, res, next) => {
    const authorization = req.get('authorization') || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
    if (!adminAuthConfigured) return res.status(503).json({ error: 'Admin dashboard is not configured.' })
    if (!isValidAdminToken(token)) return res.status(401).json({ error: 'Invalid admin session.' })
    next()
  }

  api.post('/admin/session', adminLoginLimiter, express.json({ limit: '4kb', strict: true }), (req, res) => {
    if (!adminAuthConfigured) return res.status(503).json({ error: 'Admin dashboard is not configured.' })
    const legacyToken = typeof req.body?.token === 'string' ? req.body.token.trim() : ''
    if (adminToken && legacyToken && isValidAdminToken(legacyToken)) {
      return res.status(200).json({ authenticated: true })
    }
    if (!isValidAdminCredentials(req.body?.email, req.body?.password)) {
      return res.status(401).json({ error: 'Invalid admin credentials.' })
    }
    return res.status(200).json({ authenticated: true, token: sessionToken })
  })

  api.get('/admin/messages', requireAdmin, async (_req, res) => {
    if (!isDatabaseReady()) return res.status(503).json({ error: unavailable })
    try {
      const messages = await listContacts()
      return res.status(200).json({ messages })
    } catch {
      logger.error('Admin messages could not be loaded.')
      return res.status(503).json({ error: unavailable })
    }
  })

  api.put('/admin/content', requireAdmin, express.json({ limit: '128kb', strict: true }), async (req, res) => {
    const { content, fields } = validatePortfolioContent(req.body)
    if (fields) return res.status(400).json({ error: 'Please check the content fields.', fields })
    if (!isDatabaseReady()) return res.status(503).json({ error: unavailable })
    try {
      await saveContent(content)
      return res.status(200).json({ content })
    } catch {
      logger.error('Portfolio content could not be saved.')
      return res.status(503).json({ error: unavailable })
    }
  })

  api.post('/admin/resume', requireAdmin, express.raw({ type: 'application/octet-stream', limit: MAX_RESUME_BYTES }), async (req, res) => {
    const file = validateResume(req.query.filename, req.body)
    if (!file) return res.status(400).json({ error: 'Choose a valid PDF, DOC or DOCX file, up to 5 MB.' })
    if (!isDatabaseReady()) return res.status(503).json({ error: 'CV storage is unavailable. Please try again.' })
    try {
      const saved = await saveResume(file)
      return res.status(201).json({ resumeUrl: `/api/resume/${saved._id}`, filename: file.filename })
    } catch {
      logger.error('CV upload failed.')
      return res.status(503).json({ error: 'CV upload failed. Please try again.' })
    }
  })

  api.get('/resume/:id', async (req, res) => {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(404).json({ error: 'CV not found.' })
    if (!isDatabaseReady()) return res.status(503).json({ error: 'CV is temporarily unavailable.' })
    try {
      const file = await loadResume(req.params.id)
      if (!file) return res.status(404).json({ error: 'CV not found.' })
      res.attachment(file.filename)
      res.type(file.mime)
      return res.send(file.data)
    } catch {
      logger.error('CV download failed.')
      return res.status(503).json({ error: 'CV is temporarily unavailable.' })
    }
  })

  api.delete('/admin/messages/:id', requireAdmin, async (req, res) => {
    if (!isDatabaseReady()) return res.status(503).json({ error: unavailable })
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid message id.' })
    try {
      const deleted = await deleteContact(req.params.id)
      if (!deleted) return res.status(404).json({ error: 'Message not found.' })
      return res.status(204).send()
    } catch {
      logger.error('Admin message could not be deleted.')
      return res.status(503).json({ error: unavailable })
    }
  })

  api.post('/contact', contactLimiter, (req, res, next) => {
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Send your message as application/json.' })
    }
    next()
  }, express.json({ limit: '32kb', strict: true }), async (req, res) => {
    const { contact, fields } = validateContact(req.body)
    if (fields) return res.status(400).json({ error: 'Please check the form fields.', fields })

    if (!isDatabaseReady()) return res.status(503).json({ error: unavailable })

    try {
      await saveContact(contact)
      return res.status(201).json({ message: 'Your message has been sent.' })
    } catch {
      logger.error('Contact message could not be saved.')
      return res.status(503).json({ error: unavailable })
    }
  })

  api.use((_req, res) => res.status(404).json({ error: 'API endpoint not found.' }))
  app.use('/api', api)
  if (prefix) app.use(`${prefix}/api`, api)

  if (production && existsSync(join(distPath, 'index.html'))) {
    app.use(prefix || '/', express.static(distPath, { index: false }))
    app.use((req, res, next) => {
      const insideBase = !prefix || req.path === prefix || req.path.startsWith(`${prefix}/`)
      if (req.method !== 'GET' || !insideBase || !req.accepts('html') || /\.[^/]+$/.test(req.path)) {
        return next()
      }
      res.sendFile(join(distPath, 'index.html'))
    })
  }

  app.use((_req, res) => res.status(404).json({ error: 'Page not found.' }))
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error)
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Upload or request is too large. CV files must be at most 5 MB.' })
    }
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'The request body must contain valid JSON.' })
    }
    if (error.type === 'charset.unsupported' || error.type === 'encoding.unsupported') {
      return res.status(415).json({ error: 'Send your message using UTF-8 JSON.' })
    }
    logger.error('An unexpected request error occurred.')
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' })
  })

  return app
}
