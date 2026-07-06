const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },

    bestScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const studyProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    lessons: {
      type: [lessonProgressSchema],
      default: [],
    },

    weakTopics: {
      type: [String],
      default: [],
    },

    strongTopics: {
      type: [String],
      default: [],
    },

    lastAccessed: {
      type: Date,
      default: Date.now,
    },

    totalStudyTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudyProgress", studyProgressSchema);