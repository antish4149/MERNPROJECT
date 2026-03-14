const User = require("../models/user.js");

module.exports.signUpPage = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signUp= async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        username,
        email,
      });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (req, res, next) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "user registered");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  }

  module.exports.loginPage = (req, res) => {
  res.render("users/login.ejs");
  }

  module.exports.login = async (req, res) => {
    try {
      let redirectUrl = res.locals.redirectUrl || '/listings' 
      req.flash("success", "Welcome back");
      res.redirect(redirectUrl);
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/login");
    }
  }

  module.exports.logout= (req, res, next) => {
  req.logout((err) => {
    if(err){
        return next(err);
    }
    req.flash("success", "you are logout!");
    res.redirect("/login");
  });
}