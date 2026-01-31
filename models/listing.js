const mongoose = require("mongoose");
const review = require("./review");
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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review',
        }
    ]
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;