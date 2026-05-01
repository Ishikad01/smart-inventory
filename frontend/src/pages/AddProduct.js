import React, { useState } from "react";
import { addProduct } from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "General", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error("Name, price and stock are required!");
      return;
    }
    if (form.price < 0 || form.stock < 0) {
      toast.error("Price and stock cannot be negative!");
      return;
    }
    setLoading(true);
    try {
      await addProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
      toast.success("Product added successfully!");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>➕ Add New Product</h2>
        <div style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Product Name *</label>
              <input style={styles.input} name="name" placeholder="Enter product name" value={form.name} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
                <option>General</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Food</option>
                <option>Furniture</option>
                <option>Stationery</option>
              </select>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea style={{ ...styles.input, height: "80px", resize: "vertical" }} name="description" placeholder="Product description (optional)" value={form.description} onChange={handleChange} />
          </div>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Price (₹) *</label>
              <input style={styles.input} type="number" name="price" placeholder="0" value={form.price} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Stock Quantity *</label>
              <input style={styles.input} type="number" name="stock" placeholder="0" value={form.stock} onChange={handleChange} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL (optional)</label>
            <input style={styles.input} name="imageUrl" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
          </div>
          <div style={styles.btnRow}>
            <button style={styles.cancelBtn} onClick={() => navigate("/products")}>Cancel</button>
            <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { padding: "30px", backgroundColor: "#0f0f1a", minHeight: "100vh", display: "flex", justifyContent: "center" },
  card: { backgroundColor: "#1a1a2e", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "700px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", height: "fit-content" },
  heading: { color: "white", marginBottom: "30px", fontSize: "22px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { color: "#ccc", fontSize: "14px", fontWeight: "600" },
  input: { padding: "12px 16px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#0f0f1a", color: "white", fontSize: "15px", outline: "none" },
  btnRow: { display: "flex", gap: "15px", justifyContent: "flex-end", marginTop: "10px" },
  cancelBtn: { backgroundColor: "transparent", color: "#888", border: "1px solid #333", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  btn: { backgroundColor: "#6c63ff", color: "white", border: "none", padding: "12px 30px", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer" },
};

export default AddProduct;