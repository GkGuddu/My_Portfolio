import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import test from 'node:test'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from './app.js'
import { contactMessageSchema } from './models/ContactMessage.js'

test('a real MongoDB write can be read back with timestamps', {
  skip: !process.env.TEST_MONGODB_URI && 'Set TEST_MONGODB_URI to an isolated test database to run this integration test.',
  timeout: 20000,
}, async t => {
  const collection = `portfolio_test_${randomUUID().replaceAll('-', '')}`
  const connection = mongoose.createConnection(process.env.TEST_MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  })
  t.after(async () => {
    try {
      if (connection.readyState === 1) await connection.dropCollection(collection)
    } catch (error) {
      if (error.code !== 26) throw error
    } finally {
      await connection.close()
    }
  })
  await connection.asPromise()
  const Message = connection.model('IntegrationContactMessage', contactMessageSchema.clone(), collection)
  const app = createApp({
    saveContact: contact => Message.create(contact),
    isDatabaseReady: () => connection.readyState === 1,
  })
  const response = await request(app).post('/api/contact').send({
    name: '  Test Visitor  ', email: 'TEST@example.com', message: 'A real database persistence test.',
  })
  assert.equal(response.status, 201)
  const persisted = await Message.findOne({ email: 'test@example.com' }).lean()
  assert.ok(persisted)
  assert.equal(persisted.name, 'Test Visitor')
  assert.equal(persisted.subject, '')
  assert.ok(persisted.createdAt instanceof Date)
  assert.ok(persisted.updatedAt instanceof Date)
  assert.equal(await Message.countDocuments(), 1)
})
