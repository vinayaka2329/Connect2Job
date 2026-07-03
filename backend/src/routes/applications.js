// backend/src/routes/applications.js

const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const uploadResume = require("../utils/uploadResume");

// @route   POST /api/applications
// @desc    Submit an application
// @access  Public
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      applicantEmail: req.body.applicantEmail,
      jobTitle: req.body.jobTitle,
      company: req.body.company,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job with the same email. Please check your applications.",
      });
    }

    let uploadedResume = null;
    if (req.file) {
      uploadedResume = await uploadResume(req.file);
    }

    // ✅ NEW: Get userId from request headers or body
    const userId = req.body.userId || req.headers['x-user-id'] || null;

    const application = await Application.create({
      ...req.body,
      userId: userId,  // ✅ NEW: Link application to user account
      logo: req.body.logo || "",
      logoUrl: req.body.logoUrl || "",
      resumeName: req.file ? req.file.originalname : "",
      resumeSize: req.file ? `${(req.file.size / 1024).toFixed(2)} KB` : "",
      resumeUrl: uploadedResume ? uploadedResume.secure_url : "",
      resumePublicId: uploadedResume ? uploadedResume.public_id : "",
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================================
// GET APPLICATION STATUS BY EMAIL (Old)
// =======================================
router.get('/status/:email', async (req, res) => {
  try {
    const applications = await Application.find({
      applicantEmail: req.params.email,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================================
// GET ALL APPLICATIONS BY USER ID
// =======================================
// ✅ NEW: Fetch all applications linked to a user account (regardless of email used)
router.get('/user/:userId', async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/applications
// @desc    Get all applications
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/applications/:id
// @desc   Delete an application and its associated resume file from Cloudinary
// @access Private (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // ✅ FIXED: Allow deletion of all application statuses (Pending, Accepted, Rejected)

    // Delete the resume file from Cloudinary if it exists
    if (application.resumePublicId) {
      try {
        // Attempt raw deletion (for old uploads)
        await cloudinary.uploader.destroy(application.resumePublicId, {
          resource_type: "raw",
          type: "upload",
        });

        // Attempt image deletion (for new uploads)
        await cloudinary.uploader.destroy(application.resumePublicId, {
          resource_type: "image",
          type: "upload",
        });
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
      }
    }

    // Delete the application from database
    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application and resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @route PUT /api/applications/:id/status
// @desc Update application status
// @access Private (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;