const express = require("express");
const {
  getUsers,
  createUser,
  getuser,
  login,
} = require("../controllers/users");
const {
  isValid,
  authValidation,
  createUserRules,
  loginValidation,
  userValidation,
} = require("../validation/usersValidations");
const router = express.Router();

router.post("/login", loginValidation, isValid, login);

router.get("/users", authValidation, isValid, getUsers);
router.get("/users/:id", authValidation, userValidation, isValid, getuser);

router.post("/users", createUserRules, isValid, createUser);

module.exports = router;
