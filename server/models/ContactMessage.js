import mongoose from 'mongoose'
import { CONTACT_LIMITS, EMAIL_PATTERN } from '../validation.js'

export const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: CONTACT_LIMITS.name.min,
    maxlength: CONTACT_LIMITS.name.max,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: CONTACT_LIMITS.email.max,
    match: EMAIL_PATTERN,
  },
  subject: {
    type: String,
    trim: true,
    default: '',
    maxlength: CONTACT_LIMITS.subject.max,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: CONTACT_LIMITS.message.min,
    maxlength: CONTACT_LIMITS.message.max,
  },
}, {
  timestamps: true,
  bufferCommands: false,
  strict: 'throw',
})

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)
