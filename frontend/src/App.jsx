
import React, { useState } from "react";
import Papa from "papaparse";

export default function App() {
  const [smtpAccounts, setSmtpAccounts] = useState([]);
  const [currentSmtp, setCurrentSmtp] = useState({ host: "", port: 465, secure: true, user: "", pass: "" });
  const [csvEmails, setCsvEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleCSVUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const emails = results.data.map((row) => row.email);
        setCsvEmails(emails);
      }
    });
  };

  const addSmtpAccount = () => {
    setSmtpAccounts([...smtpAccounts, currentSmtp]);
    setCurrentSmtp({ host: "", port: 465, secure: true, user: "", pass: "" });
  };

  const sendEmails = async () => {
    const res = await fetch("/api/send-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ smtpAccounts, emails: csvEmails, subject, body })
    });
    const data = await res.json();
    alert(`✅ Sent: ${data.success} | ❌ Failed: ${data.failed}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>SMTP Bulk Mail Sender</h1>
      <div>
        <input placeholder="SMTP Host" value={currentSmtp.host} onChange={(e) => setCurrentSmtp({ ...currentSmtp, host: e.target.value })} />
        <input placeholder="Port" type="number" value={currentSmtp.port} onChange={(e) => setCurrentSmtp({ ...currentSmtp, port: Number(e.target.value) })} />
        <input placeholder="Username (Email)" value={currentSmtp.user} onChange={(e) => setCurrentSmtp({ ...currentSmtp, user: e.target.value })} />
        <input placeholder="Password" type="password" value={currentSmtp.pass} onChange={(e) => setCurrentSmtp({ ...currentSmtp, pass: e.target.value })} />
        <button onClick={addSmtpAccount}>Add SMTP Account</button>
      </div>
      <hr />
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      <hr />
      <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea rows="10" value={body} onChange={(e) => setBody(e.target.value)} placeholder="HTML body here"></textarea>
      <button onClick={sendEmails}>Send Emails</button>
    </div>
  );
}
