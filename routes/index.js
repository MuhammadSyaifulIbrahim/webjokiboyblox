const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
const rankRoute = require("./rank");
const orderRoute = require("./order");

/* GET home page. */
router.use("/auth", authRoute);
router.use("/ranks", rankRoute);
router.use("/orders", orderRoute);

module.exports = router;
