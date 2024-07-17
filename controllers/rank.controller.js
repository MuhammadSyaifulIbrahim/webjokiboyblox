const { PrismaClient, PAYMENT_METHOD, PROCESSING_TIME, SERVER } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

exports.getRanks = async (req, res, next) => {
  try {
    const ranks = await prisma.rank.findMany({
      orderBy: {
        rank_order: "asc",
      },
    });

    return res.status(200).json({
      status: true,
      message: "Berhasil mendapatkan data rank",
      data: {
        ranks,
        PAYMENT_METHOD,
        PROCESSING_TIME,
        SERVER,
      },
    });
  } catch (error) {
    next(error);
  }
};
