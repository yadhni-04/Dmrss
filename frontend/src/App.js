// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UploadPage from "./pages/UploadPage";
import GrantConsentPage from "./pages/GrantConsentPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/grant" element={<GrantConsentPage />} />
        <Route path="/" element={<h2 style={{padding:"20px"}}>Welcome to DMRS</h2>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
