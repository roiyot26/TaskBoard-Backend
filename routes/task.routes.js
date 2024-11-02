import express from 'express'

import {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  removeTask
} from '../controllers/task.controller.js'

export const taskRoutes = express.Router()

taskRoutes.get('/', getTasks)
taskRoutes.get('/:taskId', getTaskById)
taskRoutes.post('/', addTask)
taskRoutes.put('/:taskId', updateTask)
taskRoutes.delete('/:taskId', removeTask)
