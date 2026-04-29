require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Smart Inventory API Running ✅" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});