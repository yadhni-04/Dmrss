// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white" }}>
      <Link to="/" style={{ marginRight: "15px", color: "white", textDecoration: "none" }}>Home</Link>
      <Link to="/upload" style={{ marginRight: "15px", color: "white", textDecoration: "none" }}>Upload Record</Link>
      <Link to="/grant" style={{ color: "white", textDecoration: "none" }}>Grant Consent</Link>
    </nav>
  );
}
