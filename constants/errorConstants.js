const AUTH_API_F_0001 = function (field) {
  return {
    {
      code: "AUTH_API-F-0001",
      level: "error",
      message: "Mandatory input missing",
      description: "Input field " + field + " is mandatory"
    }
  };
};

module.exports = { AUTH_API_F_0001 };
