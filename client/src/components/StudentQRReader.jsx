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

  // useEffect(() => {
  //   console.log("here");
  //   if (!scanResult) return; // ✅ Prevent running when scanResult is empty

  //   try {
  //     const parsedData = JSON.parse(scanResult); // ✅ Correctly parse QR data
  //     console.log("Parsed QR Data:", parsedData);

  //     const user = JSON.parse(localStorage.getItem("user")); // ✅ Get student info
  //     if (!user || !user._id) {
  //       console.error("Student ID not found in local storage");
  //       return;
  //     }

  //     const studentId = user._id; // ✅ Extract studentId correctly

  //     if (parsedData.facultyId && parsedData.subjectId && parsedData.refreshedAt) {
  //       axios.post("https://attendance-management-nine.vercel.app/mark-attendance", {
  //         studentId, // ✅ Now studentId is correctly included
  //         ...parsedData, // ✅ Send the parsed QR data
  //       })
  //       .then((res) => {
  //         alert(res.data.message);
  //         console.log("✅ Attendance marked successfully:", res.data);
  //       })
  //       .catch((err) => {
  //         console.error("❌ Error marking attendance:", err.response?.data?.error || err);
  //         alert(err.response?.data?.error || "Error marking attendance");
  //       });
  //     } else {
  //       console.error("❌ Incomplete QR data received:", parsedData);
  //     }
  //   } catch (error) {
  //     console.error("❌ QR Data Parsing Error:", error);
  //   }
  // }, []);

  const handleSubmit = async () => {
    console.log("here");
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Get student info
    if (!user || !user._id) {
      console.error("Student ID not found in local storage");
      return;
    }

    const studentId = user._id; 
    const parsedData = JSON.parse(scanResult);
    
    axios.post("https://attendance-management-u6d5.onrender.com/mark-attendance", {
        studentId, // ✅ Now studentId is correctly included
        ...parsedData, // ✅ Send the parsed QR data
      })
      .then((res) => {
        alert(res.data.message);
        console.log("✅ Attendance marked successfully:", res.data);
      })
      .catch((err) => {
        console.error("❌ Error marking attendance:", err.response?.data?.error || err);
        alert(err.response?.data?.error || "Error marking attendance");
      });
  }

  return (
    <div>
      {scanResult ? (
        <button onClick={handleSubmit}>Sumbit Attendance</button>
      ) : (
        <div id="reader" style={{ width: "300px", height: "300px" }}></div>
      )}
    </div>
  );
}

export default StudentQRReader;
