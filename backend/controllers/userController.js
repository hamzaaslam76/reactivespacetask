const UserTour = require("./../models/userTourModel");
const Tour = require("./../models/tourModel");
const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
exports.addFavuoritePlaces = catchAsync(async (req, res, next) => {
  const body = [];
  req.body.selectionModel.map((data) => {
    let obj = {};
    obj.userId = req.user._id;
    obj.tourId = data;
    body.push(obj);
  });
  const newTour = await UserTour.insertMany(body);
  res.status(201).json({
    status: "success",
    newTour,
  });
});

exports.userFavuoritePlaces = catchAsync(async (req, res, next) => {
  const data = await UserTour.find(
    { userId: req.user._id },
    { userId: 0 }
  ).populate({
    path: "tourId",
    select: "-__v ",
  });
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.deleteFavoritePlaces = catchAsync(async (req, res, next) => {
  const deleteTour = await UserTour.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    deleteTour,
  });
});
