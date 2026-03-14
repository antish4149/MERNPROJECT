const express = require("express");
const router = express.Router({ mergeParams: true }); // 👈 VERY IMPORTANT
const wrapAsync = require("../util/wrapAsync.js");
const reviwController = require('../controllers/reviews.js')
const { isLoggedIn,isReviewAuthor,validateReview} = require("../middleware.js");


router.post(
  "/",
  isLoggedIn,validateReview,
  wrapAsync(reviwController.createReview));

router.delete(
  "/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(reviwController.deleteReview));

module.exports = router;
