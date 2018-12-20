// Imports
import * as mongoose from 'mongoose'

// Connect to mongoose
mongoose.connect(
  process.env.MONGO,
  { useNewUrlParser: true, useCreateIndex: true }
)

// Export models
export * from './Chat'
