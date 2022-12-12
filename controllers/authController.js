exports.login = (req, res) => {
  console.log("Accept request");
  console.log(req.body);
  res.status(200).json({ message: "you call /auth/login from Controller" });
};

exports.register = (req, res) => {
  console.log("Accept GET request");
  res.status(200).json({ message: "you call /auth/register with POST IN CONTROLLER" });
};
