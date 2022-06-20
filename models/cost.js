const mongoose = require("mongoose")
const schema = mongoose.Schema({
    description: String,
    sum: String,
    userId: Number,
    category: mongoose.ObjectId
})

module.exports = mongoose.model("Cost", schema)