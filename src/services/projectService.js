// contact with prisma and return the fetch the user data
const {PrismaClient} = require("@prisma/client");
const { get } = require("../routes/projectRoutes");

const prisma = new PrismaClient;

//fetching the project of the user
async function getUserProjects(userId, userRole) {
  const where = userRole === "MANAGER"
  ? {} // show all projects
  : { userId }; // show only the specefic user project

  return prisma.project.findMany({
    where, 
    include: {
      user: {
        select: {
          name: true, // include.user.select.name = name of the project + name of the assigned employee 
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// now we will check from the db, whether the selected user is an employee
async function isEmployee(userId) {
  const employee = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "EMPLOYEE",
    },
    select: {
      id: true,
    },
  });
  return employee !== null;
}
//getting all employees for the manager's dropdown 

async function getAllEmployees(){
  return prisma.user.findMany({
    where: {
      role: "EMPLOYEE",
    },
    select: {
      id: true,
      name: true,
      email:true,
    },
    orderBy: {
      name: "asc"
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
async function viewProjectById(projectID, userId, userRole){
  return prisma.project.findFirst({
    where:{
      id: projectID,
      ...(userRole === "MANAGER" ? {} : {userId}),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

//updating the project of a user
async function updateProjectById(projectID, userId, data){
  const result = await prisma.project.updateMany({
    where: {
      id: projectID,
    },
    data: data, 
  });
  return result;
  
}

//delete the project of a user using id 
async function deleteProjectById(projectID) {
  return prisma.project.deleteMany({
    where: {
      id: projectID,  
    },
  });
}

module.exports= {
  getUserProjects,
  createProject,
  viewProjectById,  
  updateProjectById,
  deleteProjectById,
  isEmployee,
  getAllEmployees,
};