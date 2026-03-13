const Listing = require('./models/listing');
const { listingSchema } = require("./schema.js");
const ExpressError = require("./util/expressError.js");

module.exports.isLoggedIn =(req,res,next)=>{
  // console.log(req);
if(!req.isAuthenticated()){
  req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in!");
    return res.redirect("/login");
  }
  next();
}

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not authorized");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
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