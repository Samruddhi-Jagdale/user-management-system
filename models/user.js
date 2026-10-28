
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userUniqueId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userName: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Name must contain at least 2 characters"]
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    userAge: {
        type: Number,
        required: true,
        min: 1,
        max: 120
    }
});

module.exports = mongoose.model("User", userSchema);
