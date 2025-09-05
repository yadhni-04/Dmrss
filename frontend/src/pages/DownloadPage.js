import React, { useState } from 'react';
import API from '../api';
import './Page.css';

export default function DownloadPage() {
  const [recordId, setRecordId] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!recordId) return alert("Record ID missing");

    try {
      const res = await API.get(`/records/download/${recordId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recordId}.enc`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      alert("File downloaded (encrypted). Decrypt with symmetric key.");
    } catch (err) {
      console.error(err);
      alert("Download failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="page-container">
      <h2>Download Encrypted Record</h2>
      <form className="form-container" onSubmit={handleDownload}>
        <input type="text" placeholder="Record ID" value={recordId}
               onChange={e => setRecordId(e.target.value)} />
        <button type="submit">Download</button>
      </form>
    </div>
  );
}
