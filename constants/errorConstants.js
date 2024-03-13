const AUTH_API_F_0001 = function (field) {
  return {
      code: "AUTH_API-F-0001",
      level: "error",
      message: "Mandatory input missing",
      description: "Input field " + field + " is mandatory"
  };
};

const AUTH_API_F_0002 = function () {
  return {
    code: "AUTH_API-F-0002",
    level: "error",
    message: "Application login error",
    description: "Email not found"
  };
};

const AUTH_API_F_0003 = function () {
  return {
    code: "AUTH_API-F-0003",
    level: "error",
    message: "Unauthorized",
    description: "Passwords does not match"
  };
};

const AUTH_API_T_0001 = function (descriptionError) {
  return {
    code: "AUTH_API-T-0001",
    level: "error",
    message: "Error hashing password",
    description: descriptionError
  };
};

module.exports = { 
  AUTH_API_F_0001, 
  AUTH_API_F_0002,
  AUTH_API_F_0003,
  AUTH_API_T_0001
};
