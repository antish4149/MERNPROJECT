const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passPortLocalMongoose = require("passport-local-mongoose").default;
console.log(typeof passPortLocalMongoose);

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passPortLocalMongoose);

module.exports = mongoose.model("User", userSchema);