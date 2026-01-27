// Import required packages
const express = require("express");              // Express framework for server & routing
const { default: mongoose } = require("mongoose"); // Mongoose for MongoDB connection & models
const app = express();                            // Initialize Express app
const Listing = require("./models/listing.js");   // Import Listing model
const path = require("path");                     // Node.js path module (for handling paths)
const methodOverride = require("method-override");// For supporting PUT & DELETE requests in forms
const ejsmate = require("ejs-mate");              // Template engine for layouts & partials
const wrapAsync=require("./util/wrapAsync.js");
const ExpressError=require("./util/expressError.js");
const {listingSchema} = require("./schema.js");

// ================= MongoDB Connection ================= //
main()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // Connect to MongoDB database "wonderlust"
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

// ================= App Configuration ================= //
app.set("view engine", "ejs");                        // Set EJS as template engine
app.set("views", path.join(__dirname, "views"));      // Set views directory
app.use(express.urlencoded({ extended: true }));      // Parse form data
app.use(methodOverride("_method"));                   // Allow PUT & DELETE from forms
app.engine("ejs", ejsmate);                           // Use ejs-mate for layouts/partials
app.use(express.static(path.join(__dirname,"/public")))
// ================= Routes ================= //


const validateListing = (req,res,next)=>{ //validate middelware
  
  let {error} = listingSchema.validate(req.body);
  console.log(error);

  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

// Show all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});           // Fetch all listings from DB
  res.render("listings/index.ejs", { allListings });    // Render listings/index.ejs
}));

// Form to create a new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");                       // Show new listing form
});

// Show a single listing by ID
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);           // Find listing by ID
  res.render("listings/show.ejs", { listing });         // Render show page
}));

// Create a new listing (POST request)
app.post("/listings", validateListing,
  wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing);     // Create new Listing object
  await newListing.save();                              // Save to database
  res.redirect("/listings");                            // Redirect to all listings
  
}));

// Form to edit an existing listing
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);           // Find listing to edit
  res.render("listings/edit.ejs", { listing });         // Render edit form
}));

// Update an existing listing (PUT request)
app.put("/listing/:id", validateListing,
  wrapAsync(async (req, res) => {

  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });  // Update listing
  res.redirect(`/listings/${id}`);                               // Redirect to updated listing
}));

// Delete a listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);      // Delete by ID
  console.log(deletedListing);                                   // Log deleted document
  res.redirect("/listings");                                     // Redirect to all listings
}));

// Root route (home page)
app.get("/", (req, res) => {
  res.send("Hi, You connected");                                 // Basic test route
});


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{// error handling middleware;
  let {statusCode=500, message="Something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
})

// ================= Start Server ================= //
app.listen(8080, () => {
  console.log("Server is listening at port 8080");
});
