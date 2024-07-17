const { PrismaClient } = require("@prisma/client");
const UserSeeder = require("./user-seed");
const RankSeeder = require("./rank-seed");

const prisma = new PrismaClient();

async function main() {
  const createUser = await UserSeeder();
  const createRanks = await RankSeeder();

  console.log(createUser);
  console.log(createRanks);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
