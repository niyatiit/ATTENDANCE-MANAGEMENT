/* eslint-disable react-hooks/exhaustive-deps */
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import axios from 'axios';


function GenerateQRCode() {

  // Todo: Faculty authentication
const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [subjects, setSubjects] = useState([]);
   const [subject, setSubject] = useState();

  const value = {
    "facultyId": user?._id || "Nahi hai",
    "date": new Date().toISOString(),
    "subjectId": subject,
  }


  const [qrValue, setQrValue] = useState(JSON.stringify(value));

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = {
        ...value,
        "refreshedAt": new Date().toISOString(),
      };
      console.log(newValue);
      setQrValue(JSON.stringify(newValue));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

 useEffect(() => {
  if (subject) {
    const newValue = {
      facultyId: user?._id || "Nahi hai",
      date: new Date().toISOString(),
      subjectId: subject,  // Now subjectId is included properly
    };
    setQrValue(JSON.stringify(newValue));
  }
}, [subject]);
  
useEffect(() => {
  if (subject) {
    const newValue = {
      facultyId: user?._id || "Nahi hai",
      date: new Date().toISOString(),
      subjectId: subject,  // Now subjectId is included properly
    };
    setQrValue(JSON.stringify(newValue));
  }
}, [subject]);


  useEffect (() => {
    axios.post("https://attendance-management-nine.vercel.app/getSubject", {facultyId: user?._id}, {withCredentials: true})
    .then((res) => {
      console.log(res);
      setSubjects(res);
    })
    .catch ((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div style={{ background: 'white', padding: '16px' }}>
                  <h2>Select a Subject</h2>
                  <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">-- Select Subject --</option>
              {subjects?.data?.map((sub) => {
                if (sub.faculty === user._id) {
                  return <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                }
                else {
                  return null;
                }
              })}
          </select>

      {
        subject && 
        <QRCode 
          size={256}
          style={{ height: "500px", maxWidth: "100%", width: "100%" }}
          value={qrValue}
          viewBox={`0 0 256 256`}
        />
      }
    </div>
  );
}

export default GenerateQRCode;
