const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        image: { type: String },
        title: { type: String },
        description: { type: String },
        category: { type: String },
        subcategory: { type: String },
    },
    { timestamps: true }
);

const Work = mongoose.model("Work", workSchema);

module.exports = Work;
