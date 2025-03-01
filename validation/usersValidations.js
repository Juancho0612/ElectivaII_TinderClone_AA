const { query, body, validationResult, param } = require("express-validator");

const authValidation = [
  query("username").notEmpty().escape().isString(),
  query("password").notEmpty().escape().isString(),
];

const loginValidation = [
  body("username").notEmpty().escape().isString(),
  body("password").notEmpty().escape().isString(),
];

const isValid = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(422).json({
      error: result.array(),
    });
  } else {
    next();
  }
};

const userValidation = [param("id").notEmpty().escape().isString()];

const createUserRules = [
  body("email").notEmpty().escape().isEmail(),
  body("firstName").notEmpty().escape().isString(),
  body("lastName").notEmpty().escape().isString(),
  body("username").notEmpty().escape().isString(),
  body("password").notEmpty().escape().isString(),
  body("phone").escape().isNumeric().isLength(10),
];

module.exports = {
  isValid,
  authValidation,
  loginValidation,
  createUserRules,
  userValidation,
};
