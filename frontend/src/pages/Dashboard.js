import React, { useState, useEffect } from "react";
import { getProducts, getOrders } from "../utils/api";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6c63ff", "#e94560", "#f39c12", "#27ae60", "#3498db"];

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          getProducts(),
          getOrders(),
        ]);
        setProducts(prodRes.data);
        setOrders(orderRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const lowStock = products.filter((p) => p.stock < 10).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = products.slice(0, 6).map((p) => ({
    name: p.name.length > 10 ? p.name.substring(0, 10) + "..." : p.name,
    stock: p.stock,
    price: p.price,
  }));

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>📊 Dashboard Overview</h2>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon="📦"
          color="#6c63ff"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon="🛒"
          color="#e94560"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStock}
          icon="⚠️"
          color="#f39c12"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon="💰"
          color="#27ae60"
        />
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        {/* Bar Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>📦 Product Stock Levels</h3>
          {barData.length === 0 ? (
            <p style={styles.noData}>No products yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    color: "white",
                  }}
                />
                <Bar dataKey="stock" fill="#6c63ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>📋 Order Status Breakdown</h3>
          {pieData.length === 0 ? (
            <p style={styles.noData}>No orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.chartTitle}>🕐 Recent Orders</h3>
        {orders.length === 0 ? (
          <p style={styles.noData}>No orders yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Order ID", "Product", "Qty", "Total", "Status", "Date"].map(
                  (h) => (
                    <th key={h} style={styles.th}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} style={styles.tr}>
                  <td style={styles.td}>
                    {order._id.substring(0, 8)}...
                  </td>
                  <td style={styles.td}>
                    {order.productId?.name || "N/A"}
                  </td>
                  <td style={styles.td}>{order.quantity}</td>
                  <td style={styles.td}>₹{order.totalPrice}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor:
                          order.status === "Delivered"
                            ? "#27ae60"
                            : order.status === "Pending"
                            ? "#f39c12"
                            : order.status === "Cancelled"
                            ? "#e94560"
                            : "#6c63ff",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { padding: "30px", backgroundColor: "#0f0f1a", minHeight: "100vh" },
  heading: { color: "white", fontSize: "24px", marginBottom: "25px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  chartCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  chartTitle: {
    color: "white",
    marginBottom: "15px",
    fontSize: "16px",
  },
  noData: { color: "#888", textAlign: "center", padding: "40px 0" },
  tableCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    color: "#888",
    textAlign: "left",
    padding: "12px",
    fontSize: "13px",
    borderBottom: "1px solid #333",
    textTransform: "uppercase",
  },
  tr: { borderBottom: "1px solid #222" },
  td: { color: "#ccc", padding: "12px", fontSize: "14px" },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default Dashboard;