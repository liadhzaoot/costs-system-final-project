const mongoose = require("mongoose")
const schema = mongoose.Schema({
    description: String,
    sum: Number,
    user_id: String,
    category: mongoose.ObjectId,
    date: Date
})

module.exports = mongoose.model("Cost", schema)