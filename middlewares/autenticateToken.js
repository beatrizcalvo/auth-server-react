const autenticateToken = async (req, res, next) {
  console.log("Enter autenticateToken middleware");
  next();
};

module.exports = autenticateToken;
