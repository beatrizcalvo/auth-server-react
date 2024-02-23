const AUTH_API_T_0001 = function (descriptionError) {
  return {
    errors: [
      {
        code: "AUTH_API-T-0001",
        level: "error",
        message: "Error hashing password",
        description: descriptionError,
      },
    ],
  };
};

const AUTH_API_T_0002 = function (descriptionError) {
  return {
    errors: [
      {
        code: "AUTH_API-T-0002",
        level: "error",
        message: "Error creating user",
        description: descriptionError,
      },
    ],
  };
};

const AUTH_API_F_0001 = function () {
  return {
    errors: [
      {
        code: "AUTH_API-F-0001",
        level: "error",
        message: "Application login error",
        description: "Email not found",
      },
    ],
  };
};

const AUTH_API_F_0002 = function () {
  return {
    errors: [
      {
        code: "AUTH_API-F-0002",
        level: "error",
        message: "Application login error",
        description: "Passwords does not match"
      }
    ]
  };
};

module.exports = { 
  AUTH_API_T_0001, 
  AUTH_API_T_0002, 
  AUTH_API_F_0001,
  AUTH_API_F_0002
};
