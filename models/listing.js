const mongoose = require("mongoose");
const review = require("./review");
const user = require("./user");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
  // type: String,
  // default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  // set: (v) => v?.trim() === "" ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470" : v
  url:String,
  filename:String,
},
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
