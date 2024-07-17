const express = require("express");
const { middleware, isAdmin, isUser } = require("../middleware/middleware");
const { getOrders, getAllOrders, getOrderById, checkoutOrder, uploadPayment, statusOrder } = require("../controllers/order.controller");
const router = express.Router();

/* GET users listing. */
router.get("/", middleware, isUser, getOrders); //Get user's order
router.get("/all", middleware, isAdmin, getAllOrders); //Get order from all user
router.get("/:invoice", middleware, getOrderById); //Get order by id
router.post("/", middleware, isUser, checkoutOrder); //Checkout order
router.put("/upload/:id", middleware, isUser, uploadPayment); //Upload proof of payment
router.put("/status/:id", middleware, isAdmin, statusOrder); //Change order status

module.exports = router;
