import { taskService } from '../services/task.service.js'
import { logger } from '../services/logger.service.js'


export async function getTasks(req, res) {
    try {
        logger.debug('Getting tasks')
        const tasks = await taskService.query(req.query)
        res.send(tasks)
    } catch (err) {
        logger.error('Failed to get tasks', err)
        res.status(500).send({ err: 'Failed to get tasks' })
    }
}

export async function getTaskById(req, res) {
    try {
        const { taskId } = req.params
        const task = await taskService.getById(taskId)
        res.send(task)
    } catch (err) {
        logger.error('Failed to get task', err)
        res.status(500).send({ err: 'Failed to get task' })
    }
}

export async function addTask(req, res) {
    try {
        const task = req.body
        const addedTask = await taskService.add(task)
        res.send(addedTask)
    } catch (err) {
        logger.error('Failed to add task', err)
        res.status(500).send({ err: 'Failed to add task' })
    }
}

export async function updateTask(req, res) {
    try {
        const task = req.body
        const updatedTask = await taskService.update(req.params.taskId,task)
        res.send(updatedTask)
    } catch (err) {
        logger.error('Failed to update task', err)
        res.status(500).send({ err: 'Failed to update task' })
    }
}

export async function removeTask(req, res) {
    try {
        const { taskId } = req.params
        await taskService.remove(taskId)
        res.send('task deleted')
    } catch (err) {
        logger.error('Failed to remove task', err)
        res.status(500).send({ err: 'Failed to remove task' })
    }
}
