const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin, forgotPassword, resetPassword, preSignup, googleLogin } = require('../controllers/auth.js');

// validators
const {runValidation} = require('../validators'); //since it is named index.js you just need the dir
const {userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator} = require('../validators/auth');

router.post('/pre-signup', userSignupValidator, runValidation, preSignup); 
router.post('/signup', signup);// since we are just sending the token to this route, we don't need the validators that were created before the signup activation was created  
//router.post('/signup', userSignupValidator, runValidation, signup);  //if the 2 validations (validation, and getting validation result) pass it will run the signup
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);
//test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         message: 'you have access to secret page'
//     })
// })
router.get('/secret', requireSignin, (req, res) => {
    res.json({
        user: req.user
    })
})

//password forget/reset
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)

//google login
router.post('/google-login', googleLogin)


module.exports = router; //exports