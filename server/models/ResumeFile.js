import mongoose from 'mongoose'

const resumeFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  mime: { type: String, required: true },
  data: { type: Buffer, required: true },
}, { timestamps: true, bufferCommands: false })

export const ResumeFile = mongoose.model('ResumeFile', resumeFileSchema)
