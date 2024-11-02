import taskModel from '../models/task.model.js'


export const taskService = {
  remove,
  query,
  getById,
  add,
  update,
}

async function query() {
  try {
    const tasks = await taskModel.find()
    return tasks
  } catch (err) {
    console.log('Cannot find tasks', err)
    throw err
  }
}

async function getById(taskId) {
  try {
    const task = taskModel.findById(taskId)
    return task
  } catch (err) {
    console.log(`Cannot find task ${taskId}`, err)
    throw err
  }
}

async function remove(taskId) {
  try {
    await taskModel.findByIdAndDelete(taskId)
  } catch (err) {
    console.log(`Cannot remove task ${taskId}`, err)
    throw err
  }
}

async function add(taskToAdd) {
  try {
    const task = await taskModel.create(taskToAdd)
    return task
  } catch (err) {
    console.log('Cannot add task', err)
    throw err
  }
}

async function update(taskId,taskToUpdate) {
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(taskId, taskToUpdate, {
      new: true,      
      runValidators: true  
    })
    return updatedTask
  } catch (err) {
    console.log(`Cannot update task ${taskToUpdate._id}`, err)
    throw err
  }
}


// [
//   {
//     title: "Complete project report",
//     description: "Write the final report for the project and submit it by the end of the day.",
//     priority: 0.2,
//     createdAt: 1730372669275
//   },
//   {
//     title: "Team meeting preparation",
//     description: "Prepare the agenda and materials for the weekly team meeting.",
//     priority: 0.4,
//     createdAt: 1730432596634
//   },
//   {
//     title: "Code review",
//     description: "Review the latest pull requests on the repository.",
//     priority: 0.7,
//     createdAt: 1730536162029
//   },
//   {
//     title: "Design review",
//     description: "Check the new design proposals and provide feedback to the design team.",
//     priority: 0.1,
//     createdAt: 1730512652356
//   },
//   {
//     title: "Client call follow-up",
//     description: "Send a follow-up email with additional details to the client after the call.",
//     priority: 0.8,
//     createdAt: 1730455875786
//   }
// ]