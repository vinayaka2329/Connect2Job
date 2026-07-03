const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");
const path = require("path");

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const filename = path.parse(file.originalname).name;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Connect2Job/company-logos",
        resource_type: "image",
        public_id: `${Date.now()}-${filename}`,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

module.exports = uploadImage;