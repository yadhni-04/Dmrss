// src/pages/GrantConsentPage.js
import React, { useState } from "react";
import axios from "axios";

export default function GrantConsentPage() {
  const [recordId, setRecordId] = useState("");
  const [clinicianAddress, setClinicianAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleGrant = async (e) => {
    e.preventDefault();
    if (!recordId || !clinicianAddress) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/records/grant", { recordId, clinicianAddress });
      setMessage(res.data.message || "Consent granted successfully!");
    } catch (err) {
      setMessage("Failed to grant consent: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Grant Consent</h2>
      <form onSubmit={handleGrant}>
        <input type="text" placeholder="Record ID" value={recordId} onChange={(e) => setRecordId(e.target.value)} /><br/><br/>
        <input type="text" placeholder="Clinician Ethereum Address" value={clinicianAddress} onChange={(e) => setClinicianAddress(e.target.value)} style={{width:"400px"}} /><br/><br/>
        <button type="submit" style={{padding:"10px 20px"}}>Grant</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
