const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const stockSchema = new mongoose.Schema({

    symbol: {
        type: String
    }

}, {timestamps: true})

module.exports = mongoose.model("Stock", stockSchema);