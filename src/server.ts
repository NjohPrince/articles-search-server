import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import { env } from './config/validate-env'
import { connectToMongoDB } from './config/connect-db'
import searchRoute from './routes/search.routes'

const startServer = async () => {
  await connectToMongoDB()

  const app = express()
  const PORT = env.PORT

  const allowedOrigins = [
    'http://localhost:3000',
    'https://articles-search.vercel.app/',
    'https://articles-search.vercel.app',
  ]
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  }

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/api', searchRoute)

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      message: 'Server is up and running',
    })
  })

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

;(async () => await startServer())()
