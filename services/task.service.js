import taskModel from '../models/task.model.js'
import { logger } from './logger.service.js'

export const taskService = {
  remove,
  query,
  getById,
  add,
  update,
}

async function query({ title, priority, sortBy = 'title', isAscending = 'true', page = 1, limit = 5 }) {

  try {
    // Build the filter object based on query parameters
    const filter = {}
    if (title) filter.title = { $regex: title, $options: 'i' } // Case-insensitive title search
    if (priority) {
      if (priority === 'low') filter.priority = { $gte: 0, $lte: 0.4 }
      else if (priority === 'medium') filter.priority = { $gte: 0.4, $lte: 0.7 }
      else if (priority === 'high') filter.priority = { $gte: 0.7, $lte: 1 }
    }

    const sortOrder = isAscending === 'true' ? 1 : -1
    const sort = { [sortBy]: sortOrder }

    const tasks = await taskModel.find(filter)
      .sort(sort)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))


    const totalTasks = await taskModel.countDocuments(filter)
    const totalPages = Math.ceil(totalTasks / limit)

    // Return the tasks with pagination metadata
    return { tasks, totalTasks, totalPages }
  } catch (err) {
    logger.error('Cannot find tasks', err)
    throw err
  }

}

async function getById(taskId) {
  try {
    const task = taskModel.findById(taskId)
    return task
  } catch (err) {
    logger.error('Cannot find task', err)
    throw err
  }
}

async function remove(taskId) {
  try {
    await taskModel.findByIdAndDelete(taskId)
  } catch (err) {
    logger.error('Failed to remove task', err)
    throw err
  }
}

async function add(taskToAdd) {
  try {
    const priority = calculatePriority(taskToAdd)
    const newTaskToAdd = { ...taskToAdd, priority }
    const task = await taskModel.create(newTaskToAdd)
    return task
  } catch (err) {
    logger.error('Failed to add entity', err)
    throw err
  }
}

async function update(taskId, taskToUpdate) {
  try {
    const priority = calculatePriority(taskToUpdate)
    const newTaskToUpdate = { ...taskToUpdate, priority }
    const updatedTask = await taskModel.findByIdAndUpdate(taskId, newTaskToUpdate, {
      new: true,
      runValidators: true
    })
    return updatedTask
  } catch (err) {
    logger.error('Failed to update entity', err)
    throw err
  }
}


function calculatePriority(task) {
  const { description, title, creationDate } = task;

  // Calculate factor scores
  let descriptionLengthScore;
  if (description.length < 10) {
      descriptionLengthScore = 1;
  } else if (description.length <= 20) {
      descriptionLengthScore = 2;
  } else {
      descriptionLengthScore = 3;
  }
  
  let titleLengthScore;
  if (title.length < 5) {
      titleLengthScore = 0.5;
  } else if (title.length <= 15) {
      titleLengthScore = 1;
  } else {
      titleLengthScore = 1.5;
  }


let keywordPresenceScore = 0;
const keywords = {
    urgent: 2,
    important: 1.5,
    "low-priority": -1
};

// Check if the description or title includes any keywords
for (const [keyword, value] of Object.entries(keywords)) {
    if (description.includes(keyword) || title.includes(keyword)) {
        keywordPresenceScore += value;
    }
}

  const creationDateScore = new Date() - new Date(creationDate) < 24 * 60 * 60 * 1000 ? 1 : 0;

  const weightedScore = (descriptionLengthScore * 0.3) + (titleLengthScore * 0.2) + (keywordPresenceScore * 0.3) + (creationDateScore * 0.2);

  // Calculate maximum possible weighted score
  const maxPossibleWeightedScore = 3 * 0.3 + 1.5 * 0.2 + 3.5 * 0.3 + 1 * 0.2;

  // Calculate normalized priority score
  const normalizedPriorityScore = weightedScore / maxPossibleWeightedScore;
  const truncatedPriority = Math.floor(normalizedPriorityScore * 1000) / 1000

  return truncatedPriority;
}


