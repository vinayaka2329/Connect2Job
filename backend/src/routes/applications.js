// backend/src/routes/applications.js

const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// @route   POST /api/applications
// @desc    Submit an application
// @access  Public
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      
      // ✅ NEW: Add logo and logoUrl fields
      logo: req.body.logo || "",
      logoUrl: req.body.logoUrl || "",
      
      resumeName: req.file?.originalname || '',
      resumeSize: req.file
        ? `${(req.file.size / 1024).toFixed(2)} KB`
        : '',
      resumeUrl: req.file
        ? `/uploads/${req.file.filename}`
        : '',
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =======================================
// GET APPLICATION STATUS BY EMAIL
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
// @desc   Delete an application and its associated resume file
// @access Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
      // Allow deletion only if application is still pending
    if (application.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending applications can be deleted.',
      });
    }
    }

    // Delete the resume file if it exists
    if (application.resumeUrl) {
      const filePath = path.join(
        __dirname,
        '../../uploads',
        path.basename(application.resumeUrl)
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Application and resume deleted',
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