const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const qrcode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const connectDB = require('./config/db');
const Student = require("./model/student.model");
const Faculty = require("./model/faculty.model");
const Attendance = require("./model/attendance.model");
const Subject = require("./model/subject.model");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://attendance-management-frontend-sandy.vercel.app',
  credentials: true,
}));

// ✅ Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// ✅ Generate QR Code
app.post("/generate-qr", async (req, res) => {
  try {
    const { facultyId } = req.body;
    if (!facultyId) return res.status(400).json({ error: "Faculty ID is required" });

    const sessionId = uuidv4();
    const payload = { sessionId, timestamp: Date.now() };

    qrcode.toDataURL(JSON.stringify(payload), (err, url) => {
      if (err) return res.status(500).json({ error: "Error generating QR" });
      res.json({ qrCode: url, sessionId });
    });
  } catch (error) {
    console.error("QR Code Generation Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Fetch Subjects
app.post("/getSubject", async (req, res) => {
  try {
    const { facultyId } = req.body;
    if (!facultyId) return res.status(400).json({ msg: "Faculty ID is required" });

    const subjects = await Subject.find();
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ msg: "No subjects found" });
    }

    return res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

// ✅ Mark Attendance
app.post("/mark-attendance", async (req, res) => {
  try {
    const { studentId, qrData } = req.body;
    const { sessionId, timestamp } = JSON.parse(qrData);

    if (Date.now() - timestamp > 30000) {
      return res.status(400).json({ error: "QR code expired" });
    }

    const attendance = new Attendance({ studentId, sessionId });
    await attendance.save();
    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Register Faculty
app.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user = await Faculty.findOne({ email });
    if (user) return res.status(400).json({ error: "User already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await Faculty.create({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { secure: true, httpOnly: true });
    res.json({ message: "Registration successful", user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = (role === "student") ? await Student.findOne({ email }) : await Faculty.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role }, "secretkey", { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Logout
app.get("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
