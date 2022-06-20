const mongoose = require("mongoose")
const schema = mongoose.Schema({
    description: String,
    sum: Number,
    userId: Number,
    category: mongoose.ObjectId,
    date: Date
})

module.exports = mongoose.model("Cost", schema)