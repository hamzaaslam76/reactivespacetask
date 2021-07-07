const Tour = require('./../models/tourModel');
const appError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures');
exports.getTour = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sorts().limitFields().pagination();
    const ListOftours = await features.query;
    res.status(200).json({
        status: 'success',
        results: ListOftours.length,
        
            ListOftours
    
    });
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        newTour
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    
})
exports.searchPlace = catchAsync(async (req, res, next) => {
    const ListOftours = await Tour.find({'name': {
        '$regex': req.query.search
    }});
    res.status(200).json({
        status: 'success',
        results: ListOftours.length,
        ListOftours
    });
})