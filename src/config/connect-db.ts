import mongoose from 'mongoose'

import { env } from './validate-env'

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {})
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

export { connectToMongoDB }
