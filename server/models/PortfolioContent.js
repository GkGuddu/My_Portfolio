import mongoose from 'mongoose'

export const portfolioContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, {
  timestamps: true,
  bufferCommands: false,
  strict: 'throw',
})

export const PortfolioContent = mongoose.model('PortfolioContent', portfolioContentSchema)
