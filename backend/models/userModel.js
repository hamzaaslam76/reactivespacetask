const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
  },
  email: {
    type: String,
    required: [true, "user must be enter email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  // phone: {
  //     type: Number,
  //     maxlength: [11, 'please enter the correct number'],
  //     required: true

  // },
  photo: String,
  rules: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: [8, "password must be greater or equal 8 character"],
    required: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm password"],
    validate: {
      //this only work on create ,save
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not same",
    },
  },
  passwordResetToken: String,
  passwordResetExpire: String,
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Create encrypted password

userSchema.pre("save", async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  //Hash the password with cast of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete confirmPassword
  this.confirmPassword = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// compare password

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfterGetToken = function (JWTTimeStemp) {
  if (this.passwordChangedAt) {
    const changedTimeStemp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimeStemp < changedTimeStemp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
