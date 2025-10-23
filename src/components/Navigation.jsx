import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "PostEffects Sample" },
    { path: "/test2d", label: "Test 2D" },
    { path: "/test3d", label: "Test 3D" },
    { path: "/bulge-text", label: "Bulge Text Effect" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        padding: "1rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          WebGL Effects Showcase
        </h1>
        <div style={{ display: "flex", gap: "1rem", marginLeft: "auto" }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: location.pathname === item.path ? "#3b82f6" : "white",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(59, 130, 246, 0.2)"
                    : "transparent",
                border:
                  location.pathname === item.path
                    ? "1px solid rgba(59, 130, 246, 0.5)"
                    : "1px solid transparent",
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
