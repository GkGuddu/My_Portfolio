import assert from 'node:assert/strict'
import test from 'node:test'
import request from 'supertest'
import { createApp } from './app.js'
import { MAX_RESUME_BYTES } from './resume-validation.js'

const id = '507f1f77bcf86cd799439011'
const fixtures = [
  ['resume.pdf', Buffer.from('%PDF-1.7\nTest resume\n%%EOF'), 'application/pdf'],
  ['resume.doc', Buffer.concat([Buffer.from('d0cf11e0a1b11ae1', 'hex'), Buffer.alloc(504)]), 'application/msword'],
  ['resume.docx', Buffer.concat([Buffer.from('504b0304', 'hex'), Buffer.from('[Content_Types].xml word/document.xml')]), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
]

test('PDF, DOC and DOCX uploads require authentication and download original bytes and names', async () => {
  let stored
  const app = createApp({
    adminToken: 'test-token', isDatabaseReady: () => true,
    saveResume: async file => { stored = file; return { _id: id } },
    loadResume: async requested => requested === id ? stored : null,
  })
  assert.equal((await request(app).post('/api/admin/resume?filename=resume.pdf').send('fake')).status, 401)
  for (const [filename, bytes, mime] of fixtures) {
    const upload = await request(app).post('/api/admin/resume?filename=' + filename)
      .set('Authorization', 'Bearer test-token').set('Content-Type', 'application/octet-stream').send(bytes)
    assert.equal(upload.status, 201)
    assert.equal(upload.body.filename, filename)
    const download = await request(app).get(upload.body.resumeUrl).buffer(true).parse((response, done) => {
      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('end', () => done(null, Buffer.concat(chunks)))
    })
    assert.equal(download.status, 200)
    assert.equal(download.headers['content-type'], mime)
    assert.ok(download.headers['content-disposition'].includes(filename))
    assert.deepEqual(download.body, bytes)
  }
  assert.equal((await request(app).get('/api/resume/not-an-id')).status, 404)
  assert.equal((await request(app).get('/api/resume/507f1f77bcf86cd799439012')).status, 404)
})

test('invalid file formats, oversize uploads and unavailable storage do not publish a CV', async () => {
  let writes = 0
  const app = createApp({ adminToken: 'test-token', isDatabaseReady: () => true, saveResume: async () => { writes++; return { _id: id } } })
  for (const [filename, bytes] of [['bad.pdf', Buffer.from('<html>bad</html>')], ['bad.exe', fixtures[0][1]], ['bad.docx', Buffer.from('PK empty')], ['empty.pdf', Buffer.alloc(0)]]) {
    const result = await request(app).post('/api/admin/resume?filename=' + filename).set('Authorization', 'Bearer test-token').set('Content-Type', 'application/octet-stream').send(bytes)
    assert.equal(result.status, 400)
  }
  const large = await request(app).post('/api/admin/resume?filename=resume.pdf').set('Authorization', 'Bearer test-token').set('Content-Type', 'application/octet-stream').send(Buffer.alloc(MAX_RESUME_BYTES + 1))
  assert.equal(large.status, 413)
  assert.equal(writes, 0)
  const unavailable = createApp({ adminToken: 'test-token', isDatabaseReady: () => false })
  assert.equal((await request(unavailable).post('/api/admin/resume?filename=resume.pdf').set('Authorization', 'Bearer test-token').set('Content-Type', 'application/octet-stream').send(fixtures[0][1])).status, 503)
})

test('cross-origin content saves and CV uploads permit required methods and headers', async () => {
  const app = createApp({ clientOrigins: ['https://portfolio.example'] })
  const result = await request(app).options('/api/admin/content')
    .set('Origin', 'https://portfolio.example').set('Access-Control-Request-Method', 'PUT')
    .set('Access-Control-Request-Headers', 'Authorization,Content-Type')
  assert.equal(result.status, 204)
  assert.match(result.headers['access-control-allow-methods'], /PUT/)
  assert.match(result.headers['access-control-allow-headers'], /Authorization/)
})
