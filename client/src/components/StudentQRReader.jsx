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
    try {
      const parsedData = scanResult; // ✅ Parse scanned QR data
      console.log("Parsed QR Data:", parsedData);

      const user = JSON.parse(localStorage.getItem("user")); // ✅ Get student info
      if (!user || !user._id) {
        console.error("Student ID not found in local storage");
        return;
      }

      const studentId = user._id; // ✅ Extract studentId correctly

      if (parsedData.facultyId && parsedData.subjectId && parsedData.refreshedAt) {
        axios.post("https://attendance-management-nine.vercel.app/mark-attendance", {
          studentId, // ✅ Now studentId is correctly included
          // qrData: parsedData, // ✅ Send the parsed QR data
          ...qrData,
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.response?.data?.error || "Error marking attendance");
        });
      } else {
        console.error("Incomplete QR data received:", parsedData);
      }
    } catch (error) {
      console.error("QR Data Parsing Error:", error);
    }
}, [scanResult]);



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
