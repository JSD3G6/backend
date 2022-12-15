const cloudinary = require("../config/cloudinary");

exports.upload = async (path, publicId) => {
  const option = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: "EliteMove",
  };
  if (publicId) {
    // "" == false
    option.public_id = publicId;
  }
  const res = await cloudinary.uploader.upload(path, option);
  return res.secure_url;
};

exports.getPublicId = (secureUrl) => {
  const splitUrl = secureUrl.split("/"); // ["https:","","res.cloudinary.com",...,"cr4mxeqx5zb8rlakpfkg.jpg"]
  const publicId = splitUrl[splitUrl.length - 1].split(".")[0]; // ["cr4mxeqx5zb8rlakpfkg","jpg"]
  return publicId;
};
