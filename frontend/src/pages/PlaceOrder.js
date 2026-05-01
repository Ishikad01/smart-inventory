import React, { useState, useEffect } from "react";
import { getProducts, createOrder } from "../utils/api";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (product) => {
    if (product.stock === 0) { toast.error("Product is out of stock!"); return; }
    setSelected(product);
    setQuantity(1);
  };

  const handleOrder = async () => {
    if (!selected) { toast.error("Please select a product!"); return; }
    if (quantity < 1 || quantity > selected.stock) { toast.error(`Quantity must be between 1 and ${selected.stock}`); return; }
    setPlacing(true);
    try {
      await createOrder({ productId: selected._id, quantity: Number(quantity) });
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
    setPlacing(false);
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>🛒 Place Order</h2>
      <div style={styles.layout}>
        <div style={styles.productList}>
          <h3 style={styles.subheading}>Select a Product</h3>
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                ...styles.productItem,
                border: selected?._id === p._id ? "2px solid #6c63ff" : "2px solid transparent",
                opacity: p.stock === 0 ? 0.5 : 1,
              }}
              onClick={() => handleSelect(p)}
            >
              <div>
                <p style={styles.productName}>{p.name}</p>
                <p style={styles.productMeta}>{p.category} • Stock: {p.stock}</p>
              </div>
              <p style={styles.productPrice}>₹{p.price}</p>
            </div>
          ))}
        </div>

        <div style={styles.orderCard}>
          <h3 style={styles.subheading}>Order Summary</h3>
          {selected ? (
            <>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Product</span>
                <span style={styles.summaryValue}>{selected.name}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Price</span>
                <span style={styles.summaryValue}>₹{selected.price}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Available Stock</span>
                <span style={styles.summaryValue}>{selected.stock}</span>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Quantity</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  max={selected.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div style={{ ...styles.summaryItem, borderTop: "1px solid #333", paddingTop: "15px", marginTop: "5px" }}>
                <span style={styles.summaryLabel}>Total Amount</span>
                <span style={{ ...styles.summaryValue, color: "#6c63ff", fontSize: "22px", fontWeight: "800" }}>
                  ₹{(selected.price * quantity).toLocaleString()}
                </span>
              </div>
              <button style={styles.btn} onClick={handleOrder} disabled={placing}>
                {placing ? "Placing Order..." : "✅ Confirm Order"}
              </button>
            </>
          ) : (
            <div style={styles.noSelection}>
              <p>👈 Select a product to place order</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { padding: "30px", backgroundColor: "#0f0f1a", minHeight: "100vh" },
  heading: { color: "white", fontSize: "24px", marginBottom: "25px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "25px" },
  productList: { display: "flex", flexDirection: "column", gap: "12px" },
  subheading: { color: "#888", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", marginBottom: "15px" },
  productItem: { backgroundColor: "#1a1a2e", borderRadius: "10px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.2s" },
  productName: { color: "white", margin: 0, fontWeight: "600" },
  productMeta: { color: "#888", margin: "4px 0 0", fontSize: "13px" },
  productPrice: { color: "#6c63ff", fontWeight: "800", fontSize: "18px", margin: 0 },
  orderCard: { backgroundColor: "#1a1a2e", borderRadius: "12px", padding: "25px", height: "fit-content", display: "flex", flexDirection: "column", gap: "15px" },
  summaryItem: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { color: "#888", fontSize: "14px" },
  summaryValue: { color: "white", fontWeight: "600" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { color: "#ccc", fontSize: "14px", fontWeight: "600" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#0f0f1a", color: "white", fontSize: "15px", outline: "none" },
  btn: { backgroundColor: "#6c63ff", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "10px" },
  noSelection: { textAlign: "center", color: "#555", padding: "40px 0", fontSize: "15px" },
};

export default PlaceOrder;