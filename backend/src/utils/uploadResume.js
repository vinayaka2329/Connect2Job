// utils/uploadResume.js
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadResume = (file) => {
  return new Promise((resolve, reject) => {
    const mimeType = file.mimetype;
    let resourceType = "raw";
    let format = null;

    if (mimeType === "application/pdf") {
      resourceType = "image";
      format = "pdf";
    } else if (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      resourceType = "raw";
      const ext = file.originalname.split('.').pop().toLowerCase();
      format = ext; // 'doc' or 'docx'
    } else {
      return reject(new Error("Unsupported file type. Please upload PDF or Word document."));
    }

    const uploadOptions = {
      folder: "Connect2Job/resumes",
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    };
    if (format) uploadOptions.format = format;

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(new Error("Cloudinary upload failed: " + (error.message || "Invalid file.")));
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

module.exports = uploadResume;