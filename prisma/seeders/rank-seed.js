const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function RankSeeder() {
  return new Promise(async (resolve, reject) => {
    let ranks_data = [
      {
        name: "Iron 1",
        rank_order: 1,
        price: 0,
      },
      {
        name: "Iron 2",
        rank_order: 2,
        price: 30000,
      },
      {
        name: "Iron 3",
        rank_order: 3,
        price: 30000,
      },
      {
        name: "Bronze 1",
        rank_order: 4,
        price: 30000,
      },
      {
        name: "Bronze 2",
        rank_order: 5,
        price: 30000,
      },
      {
        name: "Bronze 3",
        rank_order: 6,
        price: 30000,
      },
      {
        name: "Silver 1",
        rank_order: 7,
        price: 30000,
      },
      {
        name: "Silver 2",
        rank_order: 8,
        price: 30000,
      },
      {
        name: "Silver 3",
        rank_order: 9,
        price: 30000,
      },
      {
        name: "Gold 1",
        rank_order: 10,
        price: 40000,
      },
      {
        name: "Gold 2",
        rank_order: 11,
        price: 40000,
      },
      {
        name: "Gold 3",
        rank_order: 12,
        price: 40000,
      },
      {
        name: "Platinum 1",
        rank_order: 13,
        price: 50000,
      },
      {
        name: "Platinum 2",
        rank_order: 14,
        price: 50000,
      },
      {
        name: "Platinum 3",
        rank_order: 15,
        price: 50000,
      },
    ];
    try {
      const deleteService = await prisma.rank.deleteMany({});

      await prisma.rank.createMany({
        data: ranks_data,
      });
      resolve("Success create service seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = RankSeeder;
