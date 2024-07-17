const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

exports.whoami = async (req, res, next) => {
  try {
    let user = await prisma.user.findUnique({
      where: {
        id: req.user_data.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    delete user.password;

    return res.status(200).json({
      status: true,
      message: "User berhasil ditemukan",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
// function login
exports.login = async (req, res, next) => {
  try {
    // Destructures 'email' and 'password' from the request body
    let { username, password } = req.body;

    // Checks if 'email' or 'password' is missing, returns a 400 response if true
    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: "Semua field harus diisi",
        data: null,
      });
    }

    // Finds the first user with the given 'email'
    let user = await prisma.user.findFirst({ where: { username } });

    // Checks if the user is not found, returns a 404 response if true
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Username atau Password salah",
        data: null,
      });
    }

    // Compares the provided password with the stored hashed password
    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Checks if the password is incorrect, returns a 400 response if true
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: "Username atau Password salah",
        data: null,
      });
    }
    // Deletes the password from the user object before returning it
    delete user.password;

    // Signs a JWT token with the user data
    let token = jwt.sign(user, JWT_SECRET);
    return res.status(200).json({
      status: true,
      message: "Anda berhasil login",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

// function register
exports.register = async (req, res, next) => {
  try {
    // Destructures 'name', 'email', and 'password' from the request body
    const { name, username, password } = req.body;

    // Checks if 'name', 'email', or 'password' is missing, returns a 400 response if true
    if (!name || !username || !password) {
      return res.status(400).json({
        status: false,
        message: "Semua field harus diisi",
        data: null,
      });
    }

    // Checks for duplicate email in the database
    const duplicate = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // If a duplicate email is found, returns a 409 response
    if (duplicate) {
      return res.status(409).json({
        status: false,
        message: "Username telah digunakan",
        data: null,
      });
    }

    // Hashes the password using bcrypt with a salt round of 10
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Creates a new user in the database with the provided data
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: encryptedPassword,
      },
    });

    // Deletes the password from the user object before returning it
    delete user.password;

    // Sends a successful response with status 201 and the created user data
    return res.status(201).json({
      status: true,
      message: "Berhasil membuat akun",
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};
