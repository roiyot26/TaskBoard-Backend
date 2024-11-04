import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { logger } from './services/logger.service.js'
import { taskRoutes } from './routes/task.routes.js'

dotenv.config({
  path:'.env'
})
const app = express()
const server = http.createServer(app)

app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5174',
      'http://localhost:5174',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.use('/api/task', taskRoutes)

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3030
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME }).then(() => {
  server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
  })
}).catch(error => {
  logger.error('had issues connecting to db', error)
})