const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const upload = require("../middleware/upload");

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// CREATE job with logo upload
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
    };

    // Parse JSON fields from FormData
    if (req.body.requirements) {
      jobData.requirements = JSON.parse(req.body.requirements);
    }

    if (req.body.benefits) {
      jobData.benefits = JSON.parse(req.body.benefits);
    }

    if (req.body.tags) {
      jobData.tags = JSON.parse(req.body.tags);
    }

    // Add logo path if file was uploaded
    if (req.file) {
      jobData.logo = `/uploads/${req.file.filename}`;
    }

    // Add logoUrl if provided (this was the missing piece!)
    if (req.body.logoUrl) {
      jobData.logoUrl = req.body.logoUrl;
    }

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job,
    });

  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// UPDATE job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// APPROVE job
router.put("/:id/approve", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        approved: true,
        status: "Active",
      },
      {
        new: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;