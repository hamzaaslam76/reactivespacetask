const express = require('express')
const router = express.Router();
const { getTour, createTour, deleteTour,searchPlace } = require('./../controllers/tourController')
router.get('/placeSearch',searchPlace)
router
    .route('/tour')
    .get(getTour)
    .post(createTour)
router
    .route('/tour/:id')
    .delete(deleteTour)
module.exports = router;