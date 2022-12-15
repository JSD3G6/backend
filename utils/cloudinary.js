const cloudinary = require("../config/cloudinary");

exports.upload = async (path, publicId) => {
  const option = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: "EliteMove",
  };
  if (publicId) {
    option.publicId = publicId;
  }
  const res = await cloudinary.uploader.upload(path, option);
  return res.secure_url;
};
