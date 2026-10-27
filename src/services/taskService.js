const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//creating a task for an existing project
async function createTask(projectId, title, description, priority, dueDate) {
  // first we have to find the project and its assigned employee
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Save the task against the project's assigne employee
  return prisma.task.create({
    data: {
      userId: project.userId,
      projectId: project.id,
      title,
      description: description || null,
      priority: priority || "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
}

//fetching tasks based on the user's role
async function getTasks(userId, userRole, projectId) {
  // manager can see all tasks
  // employee can only see task that is assigned to them
  const whereCondition = {
  ...(userRole === "MANAGER" ? {} : { userId: userId }),
  ...(projectId ? { projectId } : {}),
  };


  return prisma.task.findMany({
    where: whereCondition,

    //Include the project name with each task
    include: {
      project: {
        select: {
          name: true,
        },
      },
    },

    //show newest tasks first
    orderBy: {
      createdAt: "desc",
    },
  });
}

//getting one specefic task using its ID
async function getTaskById(taskId, userId, userRole) {
  // finding the task by ID
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },

    // Include project details with the task
    include: {
      project: {
        select: {
          name: true,
        },
      },
    },
  });

  //return null if the task does not exist
  if (!task) {
    return null;
  }

  // Employees can only view tasks assigned to them
  if (userRole !== "MANAGER" && task.userId !== userId) {
    return null;
  }

  //Managers can view any task, employees can view their own task
  return task;
}

// updating task
async function updateTaskById(taskId, data) {
  //update the task fields provided in data
  return prisma.task.update({
    where: {
      id: taskId, // finding the task using its unique id
    },
    data: {
      ...data, // applying only the fields passed by the controller
    },
  });
}

//giving the functionality to employee to update their status as todo, inprogress or completed
async function updateTaskStatus(taskId, userId, status) {
  //finding the task and verify it belongs to this employee
  const task = await prisma.task.findFirst({ // matching the taskId and emp id
    where: {
      id: taskId,
      userId: userId,
    },
  });

  // stop if the task doesn't exist or isn't assinged to this employee
  if(!task){
    return null;
  }

  //updating only the status and completion timestamp 
  return prisma.task.update({
    where: {id: taskId},
    data: {
      status: status,
      completedAt: status === "COMPLETED" ? new Date(): null,
    },
  });
}


async function deleteTaskById(taskId) {
  // deleting the task whose ID matches the given ID
  return prisma.task.delete({
    where: { id: taskId },
  });
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  updateTaskStatus,
};
