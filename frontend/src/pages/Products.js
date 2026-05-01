import React, { useState, useEffect } from "react";
import { getProducts, updateStock, deleteProduct } from "../utils/api";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products");
    }
    setLoading(false);
  };

  const handleUpdateStock = async (id) => {
    if (newStock === "" || newStock < 0) {
      toast.error("Enter valid stock value");
      return;
    }
    try {
      await updateStock(id, { stock: Number(newStock) });
      toast.success("Stock updated!");
      setEditId(null);
      setNewStock("");
      fetchProducts();
    } catch {
      toast.error("Failed to update stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted!");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.heading}>📦 Products</h2>
        <input
          style={styles.search}
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <p>No products found. Add some!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((p) => (
            <div key={p._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.category}>{p.category}</span>
                <span
                  style={{
                    ...styles.stockBadge,
                    backgroundColor: p.stock > 10 ? "#27ae60" : p.stock > 0 ? "#f39c12" : "#e94560",
                  }}
                >
                  {p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                </span>
              </div>
              <h3 style={styles.productName}>{p.name}</h3>
              <p style={styles.description}>{p.description || "No description"}</p>
              <div style={styles.details}>
                <span style={styles.price}>₹{p.price}</span>
                <span style={styles.stock}>Stock: {p.stock}</span>
              </div>

              {editId === p._id ? (
                <div style={styles.editRow}>
                  <input
                    style={styles.stockInput}
                    type="number"
                    placeholder="New stock"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                  <button
                    style={styles.saveBtn}
                    onClick={() => handleUpdateStock(p._id)}
                  >
                    Save
                  </button>
                  <button
                    style={styles.cancelBtn}
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={styles.actions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => { setEditId(p._id); setNewStock(p.stock); }}
                  >
                    ✏️ Update Stock
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { padding: "30px", backgroundColor: "#0f0f1a", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  heading: { color: "white", fontSize: "24px", margin: 0 },
  search: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#1a1a2e",
    color: "white",
    fontSize: "14px",
    width: "250px",
    outline: "none",
  },
  empty: { textAlign: "center", color: "#888", marginTop: "80px", fontSize: "18px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  category: { color: "#6c63ff", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" },
  stockBadge: { padding: "4px 10px", borderRadius: "20px", color: "white", fontSize: "11px", fontWeight: "600" },
  productName: { color: "white", margin: 0, fontSize: "18px" },
  description: { color: "#888", fontSize: "13px", margin: 0 },
  details: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { color: "#6c63ff", fontWeight: "800", fontSize: "20px" },
  stock: { color: "#aaa", fontSize: "14px" },
  editRow: { display: "flex", gap: "8px", alignItems: "center" },
  stockInput: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #333",
    backgroundColor: "#0f0f1a",
    color: "white",
    width: "80px",
    fontSize: "14px",
  },
  saveBtn: { backgroundColor: "#27ae60", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  cancelBtn: { backgroundColor: "#555", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" },
  actions: { display: "flex", gap: "8px" },
  editBtn: { flex: 1, backgroundColor: "#6c63ff", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  deleteBtn: { flex: 1, backgroundColor: "#e94560", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
};

export default Products;