const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function UserSeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        name: "Admin",
        username: "admin",
        password: await bcrypt.hash("admin12345", 10),
        role: "ADMIN",
      },
      {
        name: "User",
        username: "user",
        password: await bcrypt.hash("user12345", 10),
        role: "USER",
      },
    ];
    try {
      const deleteUser = await prisma.user.deleteMany({});

      for (item of data) {
        await prisma.user.create({
          data: item,
        });
      }
      resolve("Success create user seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = UserSeeder;
