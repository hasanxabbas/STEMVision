const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
    type: String,
    required: [true, "Lesson title is required"],
    trim: true,
    maxlength: 200,
},
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      default: "",
    },
    aiProcessed: {
    type: Boolean,
    default: false,
},
aiSummary: {
    type: String,
    default: "",
},
aiKeywords: {
    type: [String],
    default: [],
},
aiTopics: {
    type: [String],
    default: [],
},
estimatedReadingTime: {
    type: Number,
    default: 0,
},
aiDifficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: null,
},
hasDiagrams: {
    type: Boolean,
    default: false,
},
hasGraphs: {
    type: Boolean,
    default: false,
},
hasEquations: {
    type: Boolean,
    default: false,
},
version: {
    type: Number,
    default: 1,
},
isActive: {
    type: Boolean,
    default: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);