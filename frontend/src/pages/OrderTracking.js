import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../utils/api";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Pending: "#f39c12",
  Processing: "#3498db",
  Shipped: "#9b59b6",
  Delivered: "#27ae60",
  Cancelled: "#e94560",
};

const ALL_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      toast.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.heading}>📋 Order Tracking</h2>
        <div style={styles.filters}>
          {["All", ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === s ? "#6c63ff" : "#1a1a2e",
                color: filter === s ? "white" : "#888",
              }}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>No orders found</div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Order ID", "Product", "Qty", "Total", "Status", "Date", user?.role !== "customer" ? "Actions" : ""].map((h) => h && (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id} style={styles.tr}>
                  <td style={styles.td}>{order._id.substring(0, 10)}...</td>
                  <td style={styles.td}>{order.productId?.name || "N/A"}</td>
                  <td style={styles.td}>{order.quantity}</td>
                  <td style={styles.td}>₹{order.totalPrice}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: STATUS_COLORS[order.status] }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  {user?.role !== "customer" && (
                    <td style={styles.td}>
                      <select
                        style={styles.select}
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { padding: "30px", backgroundColor: "#0f0f1a", minHeight: "100vh" },
  header: { marginBottom: "25px" },
  heading: { color: "white", fontSize: "24px", marginBottom: "15px" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: { border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  empty: { textAlign: "center", color: "#888", marginTop: "80px", fontSize: "18px" },
  tableCard: { backgroundColor: "#1a1a2e", borderRadius: "12px", padding: "20px", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { color: "#888", textAlign: "left", padding: "12px", fontSize: "13px", borderBottom: "1px solid #333", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #222" },
  td: { color: "#ccc", padding: "12px", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", color: "white", fontSize: "12px", fontWeight: "600" },
  select: { backgroundColor: "#0f0f1a", color: "white", border: "1px solid #333", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
};

export default OrderTracking;