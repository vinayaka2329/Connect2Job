// // backend/src/routes/jobs.js
// const express = require('express');
// const router = express.Router();
// const Job = require('../models/Job');
// const Application = require('../models/Application'); // BUG 1: Added Application model
// const upload = require('../middleware/upload');
// const fs = require('fs');
// const path = require('path');
// const uploadImage = require("../utils/uploadImage");
// const cloudinary = require("../config/cloudinary");

// // =========================
// // GET ALL JOBS
// // =========================
// router.get('/', async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.json({ success: true, count: jobs.length, data: jobs });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // =========================
// // GET SINGLE JOB
// // =========================
// router.get('/:id', async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) {
//       return res.status(404).json({ success: false, message: 'Job not found' });
//     }
//     res.json({ success: true, data: job });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // =========================
// // CREATE JOB
// // =========================
// router.post('/', upload.single('logo'), async (req, res) => {
//   try {
//     const jobData = { ...req.body };

//     // Parse JSON fields
//     if (req.body.requirements) {
//       jobData.requirements = JSON.parse(req.body.requirements);
//     }
//     if (req.body.benefits) {
//       jobData.benefits = JSON.parse(req.body.benefits);
//     }
//     if (req.body.tags) {
//       jobData.tags = JSON.parse(req.body.tags);
//     }

//    let logo = "";
// let logoPublicId = "";

// // Upload image to Cloudinary
// if (req.file) {
//   const uploaded = await uploadImage(req.file);

//   logo = uploaded.secure_url;
//   logoPublicId = uploaded.public_id;
// }

// // If admin entered image URL instead
// else if (req.body.logo) {
//   logo = req.body.logo;
// }

// jobData.logo = logo;
// jobData.logoPublicId = logoPublicId;

//     const job = await Job.create(jobData);
//     res.status(201).json({ success: true, data: job });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // =========================
// // UPDATE JOB - FIXED
// // =========================
// router.put('/:id', upload.single('logo'), async (req, res) => {
//   try {
//     // Build job data from request body
//     const jobData = { ...req.body };

//     // Parse JSON fields
//     if (req.body.requirements) {
//       jobData.requirements = JSON.parse(req.body.requirements);
//     }
//     if (req.body.benefits) {
//       jobData.benefits = JSON.parse(req.body.benefits);
//     }
//     if (req.body.tags) {
//       jobData.tags = JSON.parse(req.body.tags);
//     }

//     // Handle new logo upload
//     const existingJob = await Job.findById(req.params.id);

// // Upload new logo
// if (req.file) {

//   // Delete previous Cloudinary image
//   if (existingJob.logoPublicId) {
//     await cloudinary.uploader.destroy(existingJob.logoPublicId);
//   }

//   const uploaded = await uploadImage(req.file);

//   // BUG 3: Clear logoUrl when uploading to Cloudinary
//   jobData.logo = uploaded.secure_url;
//   jobData.logoPublicId = uploaded.public_id;
//   jobData.logoUrl = "";
// }

// // BUG 2: Changed from req.body.logo to req.body.logoUrl
// else if (req.body.logoUrl) {
//   jobData.logo = req.body.logoUrl;
//   jobData.logoUrl = req.body.logoUrl;
//   jobData.logoPublicId = "";
// }

//     // Keep existing logoUrl if provided
//     if (req.body.logoUrl) {
//       jobData.logoUrl = req.body.logoUrl;
//     }

//     const job = await Job.findByIdAndUpdate(
//       req.params.id,
//       jobData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!job) {
//       return res.status(404).json({ success: false, message: 'Job not found' });
//     }

//     // BUG 1: Update all applications with this job's new data
//     await Application.updateMany(
//       {
//         jobTitle: job.title,
//         company: job.company,
//       },
//       {
//         $set: {
//           logo: job.logo,
//           logoUrl: job.logoUrl,
//         },
//       }
//     );

//     res.json({ success: true, data: job });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // =========================
// // DELETE JOB
// // =========================
// router.delete('/:id', async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) {
//       return res.status(404).json({ success: false, message: 'Job not found' });
//     }

//     // Delete logo file if exists
//    if (job.logoPublicId) {
//   await cloudinary.uploader.destroy(job.logoPublicId);
// }

//     await Job.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Job deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // =========================
// // APPROVE JOB
// // =========================
// router.put('/:id/approve', async (req, res) => {
//   try {
//     const job = await Job.findByIdAndUpdate(
//       req.params.id,
//       {
//         approved: true,
//         status: 'Active',
//       },
//       { new: true }
//     );

//     if (!job) {
//       return res.status(404).json({ success: false, message: 'Job not found' });
//     }

//     res.json({ success: true, data: job });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// backend/src/routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application'); // BUG 1: Added Application model
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const uploadImage = require("../utils/uploadImage");
const cloudinary = require("../config/cloudinary");

// =========================
// GET ALL JOBS
// =========================
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// GET SINGLE JOB
// =========================
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// CREATE JOB
// =========================
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const jobData = { ...req.body };

    // Parse JSON fields
    if (req.body.requirements) {
      jobData.requirements = JSON.parse(req.body.requirements);
    }
    if (req.body.benefits) {
      jobData.benefits = JSON.parse(req.body.benefits);
    }
    if (req.body.tags) {
      jobData.tags = JSON.parse(req.body.tags);
    }

   let logo = "";
let logoPublicId = "";

// Upload image to Cloudinary
if (req.file) {
  const uploaded = await uploadImage(req.file);

  logo = uploaded.secure_url;
  logoPublicId = uploaded.public_id;
}

// If admin entered image URL instead
else if (req.body.logo) {
  logo = req.body.logo;
}

jobData.logo = logo;
jobData.logoPublicId = logoPublicId;

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =========================
// UPDATE JOB - FIXED
// =========================
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    // Build job data from request body
    const jobData = { ...req.body };

    // Parse JSON fields
    if (req.body.requirements) {
      jobData.requirements = JSON.parse(req.body.requirements);
    }
    if (req.body.benefits) {
      jobData.benefits = JSON.parse(req.body.benefits);
    }
    if (req.body.tags) {
      jobData.tags = JSON.parse(req.body.tags);
    }

    // Handle new logo upload
    const existingJob = await Job.findById(req.params.id);

// Upload new logo
if (req.file) {

  // Delete previous Cloudinary image
  if (existingJob.logoPublicId) {
    await cloudinary.uploader.destroy(existingJob.logoPublicId);
  }

  const uploaded = await uploadImage(req.file);

  // BUG 3: Clear logoUrl when uploading to Cloudinary
  jobData.logo = uploaded.secure_url;
  jobData.logoPublicId = uploaded.public_id;
  jobData.logoUrl = "";
}

// Admin changed uploaded image to Image URL
else if (req.body.logoUrl) {

  // Delete old Cloudinary image if it exists
  if (existingJob.logoPublicId) {
    await cloudinary.uploader.destroy(existingJob.logoPublicId);
  }

  jobData.logo = req.body.logoUrl;
  jobData.logoUrl = req.body.logoUrl;
  jobData.logoPublicId = "";
}

    // Keep existing logoUrl if provided
    if (req.body.logoUrl) {
      jobData.logoUrl = req.body.logoUrl;
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      jobData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // BUG 1: Update all applications with this job's new data
    await Application.updateMany(
      {
        jobTitle: job.title,
        company: job.company,
      },
      {
        $set: {
          logo: job.logo,
          logoUrl: job.logoUrl,
        },
      }
    );

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =========================
// DELETE JOB
// =========================
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Delete logo file if exists
   if (job.logoPublicId) {
  await cloudinary.uploader.destroy(job.logoPublicId);
}

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// APPROVE JOB
// =========================
router.put('/:id/approve', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        approved: true,
        status: 'Active',
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;