const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../models/listing.js"); // Import Listing model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Show all listings
router.get("/", wrapAsync(listingController.index));

// Form to create a new listing
router.get("/new", isLoggedIn, listingController.renderForm);

// Show a single listing by ID
router.get("/:id", wrapAsync(listingController.showListingsById));

// Create a new listing (POST request)
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createNewListing),
);

// Form to edit an existing listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing));

// Update an existing listing (PUT request)
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing),
);

// Delete a listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing));

module.exports = router;
