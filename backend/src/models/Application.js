const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,  // ✅ NEW: Links applications to user account
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
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
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    applicantPhone: {
      type: String,
      required: true,
    },
    resumeName: {
      type: String,
    },
    resumeSize: {
      type: String,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumePublicId: {  // ✅ NEW: Store Cloudinary public ID
    type: String,
    default: '',
  },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Rejected', 'Selected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Application ||
  mongoose.model('Application', applicationSchema);