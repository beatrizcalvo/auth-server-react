exports.authenticateToken = async function (request, response, next) {
  // Extract the token from the Authorization header
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(request.method + " " + request.originalUrl);  
  next();
};
