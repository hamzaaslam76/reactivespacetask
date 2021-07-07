const express = require('express')
const router = express.Router();
const { addFavuoritePlaces,userFavuoritePlaces,deleteFavoritePlaces } = require('./../controllers/userController');
const {signup, login, protect, restrictTo, forgetPassword, resetPassword,updatePassword}=require('./../controllers/authController')
router.post('/signup', signup)
router.post('/login', login)
router.post('/addFavourit',protect,addFavuoritePlaces)
router.get('/userFavourit', protect, userFavuoritePlaces)
router.delete('/deleteFavorite/:id',deleteFavoritePlaces)
module.exports = router;