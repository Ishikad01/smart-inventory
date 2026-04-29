const router = require("express").Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrdersByStatus,
} = require("../controllers/orderController");
const { protect, managerOrAdmin } = require("../middleware/auth");

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/status/:status", protect, getOrdersByStatus);
router.put("/:id/status", protect, managerOrAdmin, updateOrderStatus);

module.exports = router;