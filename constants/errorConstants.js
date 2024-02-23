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

module.exports = { AUTH_API_T_0001 };
