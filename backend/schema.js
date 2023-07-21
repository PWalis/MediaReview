const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    email: String,
});

module.exports = {ReviewSchema, UserSchema};