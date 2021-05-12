const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require('../controllers/auth.js');

// validators
const {runValidation} = require('../validators'); //since it is named index.js you just need the dir
const {userSignupValidator, userSigninValidator} = require('../validators/auth');


router.post('/signup', userSignupValidator, runValidation, signup);  //if the 2 validations (validation, and getting validation result) pass it will run the signup
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);
//test
router.get('/secret', requireSignin, (req, res) => {
    res.json({
        message: 'you have access to secret page'
    })
})


module.exports = router; //exports