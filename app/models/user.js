const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        password: { type: String, require: true },
        details: {
            name: { type: String, require: true },
            address: { type: String, require: true },
            city: { type: String, require: true },
            state: { type: String, require: true },
            zipcode: { type: String, require: true },
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
