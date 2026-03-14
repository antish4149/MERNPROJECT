const express = require("express");
const router = express.Router({ mergeParams: true }); // 👈 VERY IMPORTANT
const { reviewJoiSchema } = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isReviewAuthor,validateReview} = require("../middleware.js");


router.post(
  "/",
  isLoggedIn,validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);
  })
);

router.delete(
  "/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
