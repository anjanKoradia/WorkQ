const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = new Schema(
    {
        posted_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        image: { type: String, require: true },
        title: { type: String, require: true },
        description: { type: String, require: true },
        volunteer_count: { type: Number, default: "1", require: true },
        category: { type: String, require: true },
        subcategory: { type: String, require: true },
        accepted: { type: Boolean, default: false, require: true },
        accepted_by: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                unique: true
            }
        ]
    },
    { timestamps: true }
);

const Work = mongoose.model("Work", workSchema);

module.exports = Work;
