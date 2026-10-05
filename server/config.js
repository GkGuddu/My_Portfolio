export function normalizeBasePath(value = '/') {
  const basePath = value.trim()
  if (!basePath || basePath === '/') return ''
  if (!/^\/[a-zA-Z0-9/_-]+\/?$/.test(basePath) || basePath.includes('//')) {
    throw new Error('BASE_PATH must be a URL path, for example /My_Portfolio/.')
  }
  return basePath.replace(/\/+$/, '')
}

export function parseOrigins(value = '') {
  return value.split(',').map(origin => origin.trim()).filter(Boolean).map(origin => {
    try {
      const url = new URL(origin)
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        url.pathname !== '/' || url.search || url.hash) throw new Error()
      return url.origin
    } catch {
      throw new Error('CLIENT_ORIGIN must contain HTTP(S) origins separated by commas.')
    }
  })
}

export function readConfig(env = process.env) {
  if (!env.MONGODB_URI?.trim()) {
    throw new Error('MONGODB_URI is required. Set it in .env before starting the server.')
  }
  if (!/^mongodb(?:\+srv)?:\/\//.test(env.MONGODB_URI.trim())) {
    throw new Error('MONGODB_URI must be a valid MongoDB connection URI.')
  }

  const port = Number(env.PORT || 3001)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
  }
  const trustProxy = Number(env.TRUST_PROXY || 0)
  if (!Number.isInteger(trustProxy) || trustProxy < 0 || trustProxy > 10) {
    throw new Error('TRUST_PROXY must be the number of trusted proxy hops (0–10).')
  }

  return {
    mongoUri: env.MONGODB_URI.trim(),
    adminToken: env.ADMIN_TOKEN?.trim() || '',
    adminEmail: env.ADMIN_EMAIL?.trim().toLowerCase() || '',
    adminPassword: env.ADMIN_PASSWORD || '',
    port,
    trustProxy,
    clientOrigins: parseOrigins(env.CLIENT_ORIGIN),
    basePath: normalizeBasePath(env.BASE_PATH),
    production: env.NODE_ENV === 'production',
  }
}
