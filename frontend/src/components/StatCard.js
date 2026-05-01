import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div style={{ ...styles.card, borderLeft: `5px solid ${color}` }}>
      <div style={styles.left}>
        <p style={styles.title}>{title}</p>
        <h2 style={{ ...styles.value, color }}>{value}</h2>
      </div>
      <div style={{ ...styles.iconBox, backgroundColor: color }}>
        <span style={styles.icon}>{icon}</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    transition: "transform 0.2s",
    cursor: "default",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    margin: 0,
    color: "#888",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  value: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
  },
  iconBox: {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
  icon: {
    fontSize: "26px",
  },
};

export default StatCard;