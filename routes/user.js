const express = require("express");
const wrapAsync = require("../util/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require('../controllers/user.js')

router.get("/signup",userController.signUpPage);

router.post(
  "/signup",
  wrapAsync(userController.signUp),
);

router.get("/login", userController.loginPage);

router.post(
  "/login",savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login),
);

router.get("/logout", userController.logout);

module.exports = router;
