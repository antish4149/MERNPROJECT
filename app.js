
const express = require("express"); // Express framework for server & routing
const { default: mongoose } = require("mongoose"); // Mongoose for MongoDB connection & models
const app = express(); // Initialize Express app
const path = require("path"); // Node.js path module (for handling paths)
const methodOverride = require("method-override"); // For supporting PUT & DELETE requests in forms
const ejsmate = require("ejs-mate"); // Template engine for layouts & partials
const ExpressError = require("./util/expressError.js");
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');



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
app.use(express.static(path.join(__dirname, "/public")));






app.use('/listings',listings);

//review
app.use('/listings/:id/reviews',reviews)

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
  console.log("Server is listening at port 8080");
});
