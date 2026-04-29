const router = require("express").Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateStock,
  deleteProduct,
} = require("../controllers/productController");
const { protect, managerOrAdmin, adminOnly } = require("../middleware/auth");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, managerOrAdmin, addProduct);
router.put("/inventory/:id", protect, managerOrAdmin, updateStock);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;