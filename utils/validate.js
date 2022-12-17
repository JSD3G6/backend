const checkUserWithUserID = (user, checkId) => {
  let id = user._id.toString();
  if (id !== checkId) {
    return false;
  }
  return true;
};

module.exports = { checkUserWithUserID };
