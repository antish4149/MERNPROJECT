const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});





router
.route('/')
.get(wrapAsync(listingController.index))// Show all listings
.post(isLoggedIn, // Create a new listing (POST request)
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createNewListing))

// Form to create a new listing
router.get("/new", isLoggedIn, listingController.renderForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListingsById)) // Show a single listing by ID
.put( // Update an existing listing (PUT request)
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing))
.delete( // Delete a listing
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing));

// Form to edit an existing listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing));

module.exports = router;
