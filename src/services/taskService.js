const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient;

//creating a new task for a user's project 

async function createTask(userId, projectId, title, description, priority, dueDate) {
  // first we have to verify that projects belong to this user only 
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: userId,
    },
  });

  if(!project){
    throw new Error("Project not found or access denied");
  }

  // creating a task now 
  return prisma.task.create({
    data: {
      userId: userId,
      projectId: projectId,
      title: title,
      description: description || null,
      priority: priority || "MEDIUM", 
      dueDate: dueDate ? new Date(dueDate):null,
    },
  });
}

module.exports = {
  createTask,
};