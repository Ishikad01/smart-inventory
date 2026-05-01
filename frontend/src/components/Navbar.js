import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Products", path: "/products", icon: "📦" },
    { label: "Add Product", path: "/add-product", icon: "➕" },
    { label: "Place Order", path: "/place-order", icon: "🛒" },
    { label: "Order Tracking", path: "/orders", icon: "📋" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate("/dashboard")}>
        📦 <span style={styles.logoText}>SmartInventory</span>
      </div>
      <div style={styles.navLinks}>
        {navItems.map((item) => (
          <button
            key={item.path}
            style={{
              ...styles.navBtn,
              backgroundColor:
                location.pathname === item.path
                  ? "#6c63ff"
                  : hovered === item.path
                  ? "rgba(108,99,255,0.15)"
                  : "transparent",
              color:
                location.pathname === item.path ? "white" : "#ccc",
            }}
            onMouseEnter={() => setHovered(item.path)}
            onMouseLeave={() => setHovered("")}
            onClick={() => navigate(item.path)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
      <div style={styles.userSection}>
        <span style={styles.userInfo}>
          👤 {user?.name} ({user?.role})
        </span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#1a1a2e",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoText: {
    color: "#6c63ff",
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  navLinks: {
    display: "flex",
    gap: "5px",
  },
  navBtn: {
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  userInfo: {
    color: "#aaa",
    fontSize: "13px",
  },
  logoutBtn: {
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  },
};

export default Navbar;