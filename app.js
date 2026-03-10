
const express = require("express"); // Express framework for server & routing
const { default: mongoose } = require("mongoose"); // Mongoose for MongoDB connection & models
const app = express(); // Initialize Express app
const path = require("path"); // Node.js path module (for handling paths)
const methodOverride = require("method-override"); // For supporting PUT & DELETE requests in forms
const ejsmate = require("ejs-mate"); // Template engine for layouts & partials
const ExpressError = require("./util/expressError.js");
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



main()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}


app.set("view engine", "ejs"); // Set EJS as template engine
app.set("views", path.join(__dirname, "views")); // Set views directory
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Allow PUT & DELETE from forms
app.engine("ejs", ejsmate); // Use ejs-mate for layouts/partials
app.use(express.static(path.join(__dirname, "/public"))); // server static file directly through url 


const sessionParam = {
  secret: "mysupersecretcode",
  resave: false,
  saveUnintialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security against cross scripting attack
  }
}
app.use(session(sessionParam));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "antishyadav311@gmail.com",
    username: "antish-yadav",
  })

  let registerUser = await User.register(fakeUser, "helloworld");
  res.send(registerUser);
})

app.use('/listings', listingsRouter);
//review
app.use('/listings/:id/reviews', reviewsRouter)
app.use('/',userRouter);

// Root route (home page)
app.get("/", (req, res) => {
  res.send("Hi, You connected"); // Basic test route
});

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  // error handling middleware;
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});


app.listen(8080, () => {
  console.log("http://localhost:8080");
});
