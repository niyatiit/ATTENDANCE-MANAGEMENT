import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import axios from 'axios';

function GenerateQRCode() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");

  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    axios.post("https://attendance-management-nine.vercel.app/getSubject", 
      { facultyId: user?._id }, 
      { withCredentials: true }
    )
    .then((res) => {
      console.log(res);
      setSubjects(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    if (subject) {
      const newValue = {
        facultyId: user?._id || "Nahi hai",
        date: new Date().toISOString(),
        subjectId: subject,
        refreshedAt: new Date().toISOString(),
      };
      setQrValue(JSON.stringify(newValue));
    }
  }, [subject]);

  return (
    <div style={{ background: 'white', padding: '16px' }}>
      <h2>Select a Subject</h2>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">-- Select Subject --</option>
        {subjects?.map((sub) => (
          sub.faculty === user._id ? (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ) : null
        ))}
      </select>

      {subject && (
        <QRCode 
          size={256}
          style={{ height: "500px", maxWidth: "100%", width: "100%" }}
          value={qrValue}
          viewBox="0 0 256 256"
        />
      )}
    </div>
  );
}

export default GenerateQRCode;
