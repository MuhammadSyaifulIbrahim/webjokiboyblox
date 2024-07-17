const express = require("express");
const { middleware, isAdmin } = require("../middleware/middleware");
const { getRanks } = require("../controllers/rank.controller");
const router = express.Router();

/* GET users listing. */
router.get("/", getRanks);

module.exports = router;
