const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const dataSchema = new mongoose.Schema({
    time: {
        type: Date
    },
    totalCE: {
        type: Number,
    },
    // changeInCE: {
    //     type: Number
    // },
    totalPE: {
        type: Number
    },
    // changeInPE: {
    //     type: Number
    // },
    totalPE: {
        type: Number
    },
    pcr: {
        type: String
    },
    ltp: {
        type: Number
    },
    sym: {
        type: String
    },
    

}, {timestamps: true})

module.exports = mongoose.model("Data", dataSchema);