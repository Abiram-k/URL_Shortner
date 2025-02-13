const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true ,unique:true},
    password: { type: String, required: true },
    urls: [
        {
            longUrl: { type: String },
            shortCode: { type: String },
            createdAt: { type: Date, default: Date.now },
            qrCode: { type: String },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
