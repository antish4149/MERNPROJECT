const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type:String,
        default:"https://unsplash.com/photos/golden-mountain-peaks-at-sunset-with-dramatic-clouds-IyhdFcaRYqE",
        set:(v)=>
            v===" "?"https://unsplash.com/photos/golden-mountain-peaks-at-sunset-with-dramatic-clouds-IyhdFcaRYqE":v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;