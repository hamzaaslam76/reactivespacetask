const express = require("express");
const app = express();
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./Routers/userRouter");
const tourRouter = require("./Routers/tourRouter");
const cors = require("cors");
if (process.env.Node_ENV === "development") {
  console.log("development");
}
app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1", tourRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server `, 400));
});
app.use(globalErrorHandler);

module.exports = app;
