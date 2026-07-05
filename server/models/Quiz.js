const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === 4;
        },
        message: "Each question must have exactly 4 options.",
      },
    },

    correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
},
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);