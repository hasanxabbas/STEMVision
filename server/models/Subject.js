const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: [true, "Subject code is required"],
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    institution: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
    },

    icon: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#2563EB",
    },

    order: {
      type: Number,
      default: 1,
      min: 1,
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
subjectSchema.index(
  { institution: 1, code: 1 },
  { unique: true }
);

module.exports = mongoose.model("Subject", subjectSchema);