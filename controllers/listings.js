const Listing = require('../models/listing')

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from DB
    res.render("listings/index.ejs", { allListings }); // Render listings/index.ejs
}

module.exports.renderForm = (req, res) => {
  res.render("listings/new.ejs"); // Show new listing form
}

module.exports.showListingsById = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate({ path: "owner" });
    // Find listing by ID
    if (!listing) {
      req.flash("error", "Listing not found");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing }); // Render show page
  }

  module.exports.createNewListing=async (req, res, next) => {
      let url=req.file.path;
      let filename=req.file.filename;
      // S
      const newListing = new Listing(req.body.listing); // Create new Listing object
      newListing.owner = req.user._id;
      newListing.image={url,filename};
      await newListing.save(); // Save to database
      req.flash("success", "New Listing Created");
      res.redirect("/listings"); // Redirect to all listings
    }

    module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id); // Find listing to edit
    req.flash("success", "Listing edited");
    res.render("listings/edit.ejs", { listing }); // Render edit form
  }

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing
    if(typeof req.file!="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`); // Redirect to updated listing
  }

  module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // Delete by ID
    console.log(deletedListing); // Log deleted document
    req.flash("success", "Listing Deleted");
    res.redirect("/listings"); // Redirect to all listings
  }