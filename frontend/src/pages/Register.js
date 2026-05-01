import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required!");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>📦 SmartInventory</h1>
          <p style={styles.subtitle}>Create your account</p>
        </div>
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.input}
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            style={styles.btn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <p style={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#0f0f1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    color: "#6c63ff",
    fontSize: "28px",
    margin: 0,
  },
  subtitle: {
    color: "#888",
    marginTop: "8px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#ccc",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#0f0f1a",
    color: "white",
    fontSize: "15px",
    outline: "none",
  },
  btn: {
    backgroundColor: "#6c63ff",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
  },
  switchText: {
    textAlign: "center",
    color: "#888",
    fontSize: "14px",
  },
  link: {
    color: "#6c63ff",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Register;