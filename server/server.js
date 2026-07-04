const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Database Connection
const connectDB = require("./database/connectDB");
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const subjectRoutes = require("./routes/subject.routes");
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require("./routes/student.routes");
const lessonRoutes = require("./routes/lesson.routes");
const quizRoutes = require("./routes/quiz.routes");
const aiRoutes = require("./routes/ai.routes");
const notificationRoutes = require("./routes/notification.routes");

const errorHandler = require("./middleware/error.middleware");

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "STEMVision Backend is Running 🚀",
  });
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});