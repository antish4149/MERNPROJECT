const express = require('express');
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { listingSchema} = require("../schema.js");
const ExpressError = require("../util/expressError.js");
const Listing = require("../models/listing.js"); // Import Listing model




const validateListing = (req, res, next) => {
  //validate middelware

  let { error } = listingSchema.validate(req.body);
  console.log(error);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
// Show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from DB
    res.render("listings/index.ejs", { allListings }); // Render listings/index.ejs
  }),
);

// Form to create a new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs"); // Show new listing form
});

// Show a single listing by ID
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // Find listing by ID
    res.render("listings/show.ejs", { listing }); // Render show page
  }),
);

// Create a new listing (POST request)
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing); // Create new Listing object
    await newListing.save(); // Save to database
    res.redirect("/listings"); // Redirect to all listings
  }),
);

// Form to edit an existing listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id); // Find listing to edit
    res.render("listings/edit.ejs", { listing }); // Render edit form
  }),
);

// Update an existing listing (PUT request)
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing
    res.redirect(`/listings/${id}`); // Redirect to updated listing
  }),
);

// Delete a listing
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // Delete by ID
    console.log(deletedListing); // Log deleted document
    res.redirect("/listings"); // Redirect to all listings
  }),
);

module.exports = router;