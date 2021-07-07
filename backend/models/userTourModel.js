const mongoose = require('mongoose')

const userTourSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    tourId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const UserTour = mongoose.model('UserTour', userTourSchema);
module.exports = UserTour;