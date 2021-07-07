const mongoose = require('mongoose')

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Place name is required']
    },
    address: {
        type: String,
        required:[true,'address is required']
    },
    phoneNumber: {
        type: Number,
        maxlength: [11, 'please enter the correct number'],
        required:true
    },
    type: {
        type: String,
        required:[true,'Place type is required']
    }
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;