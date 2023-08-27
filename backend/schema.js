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
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

const TokenSchema = new mongoose.Schema({
    token: String,
    userId: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 432000
    }
});

const ProfileImgSchema = new mongoose.Schema({
    fileName: String,
    userID: String
});

module.exports = {ReviewSchema, UserSchema, TokenSchema, ProfileImgSchema};