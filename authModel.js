const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        required: [true, 'Password is required']
    },
    isPhoneVerified: { type: Boolean, default: false },
    phoneOtp: String,
    phoneOtpExpires: Date,
    role: {
        type: String,
        enum: ['user', 'admin', 'customer'],
        default: 'user'
    },
    passwordChangedAt: Date,
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
