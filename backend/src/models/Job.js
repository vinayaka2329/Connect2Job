const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "Full Time",
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    contactEmail: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    logoUrl: {
      type: String,
      default: "",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: String,
      default: "Community Member",
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Closed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);