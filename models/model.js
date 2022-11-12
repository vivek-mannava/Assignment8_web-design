const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
   
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("assignment08",postSchema);