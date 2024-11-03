import taskModel from '../models/task.model.js'


export const taskService = {
  remove,
  query,
  getById,
  add,
  update,
}

// async function query(filter) {
//   try {
//     console.log(filter)
//     const tasks = await taskModel.find()
//     return tasks
//   } catch (err) {
//     console.log('Cannot find tasks', err)
//     throw err
//   }
// }

async function query({ title, priority, sortBy = 'title', isAscending = 'true', page = 1, limit = 5 }) {

  try {
    // Build the filter object based on query parameters
    const filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive title search
    if (priority) {
      if (priority === 'low') filter.priority = { $gte: 0, $lte: 0.3 };
      else if (priority === 'medium') filter.priority = { $gte: 0.4, $lte: 0.6 };
      else if (priority === 'high') filter.priority = { $gte: 0.7, $lte: 1 };
    }
    // Set sorting order
    const sortOrder = isAscending === 'true' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Query the database with filtering, sorting, and pagination
    const tasks = await taskModel.find(filter)
      .sort(sort)
      .skip((page - 1) * Number(limit)) // Pagination offset
      .limit(Number(limit)); // Limit the number of results per page

    // Calculate total tasks and total pages
    const totalTasks = await taskModel.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    // Return the tasks with pagination metadata
    console.log(tasks)

    // return tasks
    return { tasks, totalTasks, totalPages };
  } catch (err) {
    console.error('Error in taskService.query:', err);
    throw err;
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

async function update(taskId, taskToUpdate) {
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