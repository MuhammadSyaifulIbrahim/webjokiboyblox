const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getTotalPayment } = require("../libs/order.libs");
const { uploader } = require("../libs/cloudinary.libs");
const crypto = require("crypto");
const path = require("path");
const { JWT_SECRET } = process.env;

exports.getOrders = async (req, res, next) => {
  try {
    // Extract pagination parameters from query string
    const { page = 1 } = req.query;
    const limit = 8;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        take: limit,
        skip: skip,
        where: {
          user_id: req.user_data.id,
        },
        include: {
          account: true,

          from_rank: true,
          to_rank: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({
        where: {
          user_id: req.user_data.id,
        },
      }),
    ]);

    // Calculate total pages based on the pagination limit
    const totalPage = Math.ceil(total / limit);

    // Return the orders data with pagination information
    return res.status(200).json({
      status: true,
      message: "Berhasil mendapatkan data pesanan",
      data: {
        orders,
        page: +page,
        total_pages: totalPage,
        total_items: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    // Extract pagination parameters from query string
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        take: limit,
        skip: skip,
        include: {
          account: true,
          from_rank: true,
          to_rank: true,
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({}),
    ]);

    // Calculate total pages based on the pagination limit
    const totalPage = Math.ceil(total / limit);

    // Return the orders data with pagination information
    return res.status(200).json({
      status: true,
      message: "Berhasil mendapatkan data pesanan",
      data: {
        orders,
        page: +page,
        total_pages: totalPage,
        total_items: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { invoice } = req.params;

    const order = await prisma.order.findUnique({
      where: {
        no_invoice: invoice,
        user_id: req.user_data.id,
      },
      include: {
        account: true,
        from_rank: true,
        to_rank: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Data pesanan tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mendapatkan data pesanan",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.checkoutOrder = async (req, res, next) => {
  try {
    const { phone, username, password, service_id, from_rank_id, to_rank_id, server, processing_time, payment_method = "QRIS" } = req.body;

    let total_payment;
    try {
      total_payment = await getTotalPayment(req);
    } catch (error) {
      return res.status(error.statusCode).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
    const no_invoice = `INV${new Date().getTime()}`;

    const checkout = await prisma.order.create({
      data: {
        no_invoice: no_invoice,
        phone,
        user_id: req.user_data.id,
        from_rank_id,
        to_rank_id,
        server,
        processing_time,
        payment_method,
        total_payment,
        account: {
          create: {
            username,
            password,
          },
        },
      },
      include: {
        account: true,
        from_rank: true,
        to_rank: true,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Berhasil membuat pesanan",
      data: {
        checkout,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = req?.files?.image;

    const order = await prisma.order.findUnique({
      where: {
        id: id,
        user_id: req.user_data.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Data pesanan tidak ditemukan",
        data: null,
      });
    }

    if (order.payment_image) {
      return res.status(400).json({
        status: false,
        message: "Bukti pembayaran sudah diupload sebelumnya",
        data: null,
      });
    }

    if (!image) {
      return res.status(400).json({
        status: false,
        message: "Bukti pembayaran harus disertakan",
        data: null,
      });
    }

    image.publicId = crypto.randomBytes(16).toString("hex");
    image.name = `${image.publicId}${path.parse(image.name).ext}`;

    const imageUpload = await uploader(image);

    await prisma.order.update({
      where: {
        id: id,
        user_id: req.user_data.id,
      },
      data: {
        payment_image: imageUpload.secure_url,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Bukti pembayaran berhasil diupload",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.statusOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Data pesanan tidak ditemukan",
        data: null,
      });
    }

    const STATUS = {
      PENDING: true,
      SELESAI: true,
    };

    if (!STATUS[status]) {
      return res.status(400).json({
        status: false,
        message: "Status pesanan tidak valid",
        data: null,
      });
    }

    if (status === "SELESAI" && !order.payment_image) {
      return res.status(400).json({
        status: false,
        message: "Pesanan belum dibayar",
        data: null,
      });
    }

    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        order_status: status,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Status pesanan berhasil diperbarui",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
