const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Uploads a PDF buffer to Cloudinary as an 'image' resource type with PDF format.
 * This avoids the 401 raw file delivery settings on Cloudinary free accounts.
 * 
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} Object containing secure_url and public_id
 */
const uploadResume = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Connect2Job/resumes",
        resource_type: "image", // Bypasses the 401 Raw security policy
        format: "pdf",          // Ensures it stays/delivers as a PDF
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

module.exports = uploadResume;