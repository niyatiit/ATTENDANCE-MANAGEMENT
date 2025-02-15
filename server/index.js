 const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());

app.use(cookieParser());
// Enable CORS for your React app (adjust origin as needed)
app.use(cors({
  origin: 'https://attendance-management-frontend-sandy.vercel.app', // e.g., React dev server port
  credentials: true,
}));
const port = 3000;
const Student = require("./model/student.model");
const Faculty = require("./model/faculty.model");
const Attendance = require("./model/attendance.model");
const Subject = require("./model/subject.model");
const connectDB = require('./config/db')

try{  
connectDB();
}
catch(err){
    console.log("Error Connecting Database",err);
}
app.get("/", (req, res) => {
  res.send("backend server is running");
});
app.post("/generate-qr", async (req, res) => {
  const { facultyId } = req.body;
  const sessionId = uuidv4();
  const payload = { sessionId, timestamp: Date.now() };
  qrcode.toDataURL(JSON.stringify(payload), (err, url) => {
    if (err) return res.status(500).send({ error: "Error generating QR" });
    res.send({ qrCode: url, sessionId });
  });
});

// Middleware to parse JSON

app.post("/getSubject", async (req, res) => {
  try {
    const { facultyId } = req.body;

    // Step 1: Check if facultyId is provided
    if (!facultyId) {
      return res.status(400).json({ msg: "Faculty ID is required" });
    }

    // Step 2: Convert facultyId to ObjectId only if it's a valid MongoDB ObjectId
    // if (!mongoose.Types.ObjectId.isValid(facultyId)) {
    //   return res.status(400).json({ msg: "Invalid Faculty ID format" });
    // }
    
    // const facultyObjectId = new mongoose.Types.ObjectId(facultyId);

    // Step 3: Fetch subjects from database
    const subs = await Subject.find({faculty :new mongoose.Types.ObjectId(facultyId)});

    // Step 4: Check if subjects exist
    if (!subs || subs.length === 0) {
      return res.status(404).json({ msg: "No subjects found for this Faculty ID"  , facultyId});
    }

    // Step 5: Return the subjects
    return res.status(200).json(subs);
    
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

// Start Express server



app.post("/mark-attendance", async (req, res) => {
  const { studentId, qrData } = req.body;
  const { facultyId, refreshedAt } = JSON.parse(qrData);
  if (Date.now() - refreshedAt > 30000) {
    return res.status(400).send({ error: "QR code expired" });
  }
  const attendance = new Attendance({ studentId, sessionId });
  await attendance.save();
  res.send({ message: "Attendance marked successfully" });
});
app.post("/register", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let user = await Faculty.findOne({ email });
        if (user) return res.status(400).send("User already registered");

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) throw err;

                user = await userModel.create({
                    username: username,
                    name: name,
                    age: age,
                    email: email,
                    password: hash
                });

                let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);
                res.cookie("token", token, { secure: true, httpOnly: true });
                res.redirect("/profile");
            });
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
});

const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
    const { role, email, password } = req.body;
    console.log(role, email, password);

    if (!role || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let user;
    if (role === "student") {
        user = await Student.findOne({ email: email });
    } else if (role === "faculty") {
        user = await Faculty.findOne({ email: email });
    } else {
        return res.status(400).json({ message: "Invalid role" });
    }

    console.log(user);

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    if (password !== user.password) {
        return res.status(401).json({ message: "Login Failed!! Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, "secretkey", { expiresIn: "1h" });

    // Store token in an HTTP-only cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Set to true in production (requires HTTPS)
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({ message: "Login successful", user });
});


app.get("/logout", (req, res) => {
    res.cookie("token", "");
});
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//     console.log(req.body);
    
//   // Check if the user exists in the Student model
//   let user = await Student.findOne({ email });
//   let role = "student";
//   console.log(1,user);
  

//   // If not found in Student, check Faculty model
//   if (!user) {
//     user = await Faculty.findOne({ email });
//     role = "faculty";
//   }
//   console.log(2,user);
  
//   // If user is not found in both collections
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).send({ error: "Invalid credentials" });
//   }
//   console.log(3,user);
  
//   // Generate JWT token
//   const token = jwt.sign({ id: user._id, role }, "secretkey");

//   res.send({ token, role });
// });
app.listen(port, (req, res) => {
  console.log("listening on", port);
});
