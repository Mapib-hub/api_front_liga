import React from "react";

const SerieCard = ({ nombre, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "#1a1f2b",
        borderRadius: "8px",
        padding: "15px 10px",
        textAlign: "center",
        border: "1px solid #2d3748",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#10b981")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2d3748")}
    >
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏆</div>
      <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
        {nombre}
      </div>
    </div>
  );
};

export default SerieCard;
