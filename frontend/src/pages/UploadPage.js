// src/pages/UploadPage.js
import React, { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [patientAddress, setPatientAddress] = useState("");
  const [recordId, setRecordId] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !patientAddress || !recordId) {
      setMessage("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientAddress", patientAddress);
    formData.append("recordId", recordId);

    try {
      const res = await axios.post("http://localhost:4000/api/records/upload", formData);
      setMessage(`Upload successful! CID: ${res.data.cid}`);
    } catch (err) {
      setMessage("Upload failed: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Medical Record</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} /><br/><br/>
        <input type="text" placeholder="Patient Ethereum Address" value={patientAddress} onChange={(e) => setPatientAddress(e.target.value)} style={{width:"400px"}} /><br/><br/>
        <input type="text" placeholder="Record ID" value={recordId} onChange={(e) => setRecordId(e.target.value)} /><br/><br/>
        <button type="submit" style={{padding:"10px 20px"}}>Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
