// contact with prisma and return the fetch the user data
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient;

//fetching the project of the user
async function getUserProjects(userId) {
  return prisma.project.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

//creating a new project 
async function createProject(userId, name, description){
  return prisma.project.create({
    data: {
      userId: userId,
      name: name,
      description: description,
    },
  });
}

//view the projects of a user by id
async function viewProjectById(projectID, userId){
  return prisma.project.findFirst({
    where:{
      id: projectID,
      userId: userId,
    },
  });
}

//updating the project of a user
async function updateProjectById(projectID, userId, data){
  const result = await prisma.project.updateMany({
    where: {
      id: projectID,
      userId: userId,
    },
    data: data, 
  });
  console.log(result);
  return result;
  
}

//delete the project of a user using id 
async function deleteProjectById(projectID, userId) {
  return prisma.project.deleteMany({
    where: {
      id: projectID,
      userId: userId,
    },
  });
}

module.exports= {
  getUserProjects,
  createProject,
  viewProjectById,  
  updateProjectById,
  deleteProjectById,
};