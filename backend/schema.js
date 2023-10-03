const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: String,
    rating: Number,
    content: String,
    draft: Boolean,
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
    description: String,
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    drafts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    subscribed: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
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
    userID: String,
    signedUrl: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = {ReviewSchema, UserSchema, TokenSchema, ProfileImgSchema};