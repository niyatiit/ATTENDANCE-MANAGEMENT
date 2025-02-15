import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';

function StudentQRReader() {
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10, // Frames per second
        qrbox: { width: 250, height: 250 }, // QR code scanning area
        aspectRatio: 1.0,
        disableFlip: false, // Flip support for rear/front cameras
      },
      false
    );

    scanner.render(
      (result) => {
        console.log("Scanned QR Code:", result);
        setScanResult(result);
        scanner.clear(); // Stop scanning after success
      },
      (error) => {
        console.warn("QR Scan Error:", error);
      }
    );

    return () => scanner.clear(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const studentId = localStorage.getItem("user")._id;
    if(studentId && scanResult?.facultyId && scanResult?.subjectId && scanResult?.refreshedAt){
    axios.post("https://attendance-management-nine.vercel.app/mark-attendance", {studentId, qrData: scanResult})
    .then((res) => {
       alert(res.data); 
    })
    .catch (err => {
      alert(err);
    })
    }
  }, [scanResult])

  return (
    <div>
      <h3>Scan QR Code</h3>
      {scanResult ? (
        <p>✅ Scanned Result: {scanResult}</p>
      ) : (
        <div id="reader" style={{ width: "300px", height: "300px" }}></div>
      )}
    </div>
  );
}

export default StudentQRReader;
