const express = require('express');
const router = express.Router();
const {  requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth.js');
const { read, publicProfile, update, photo } = require('../controllers/user');


router.get('/user/profile', requireSignin, authMiddleware, read); //private profile
//test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         message: 'you have access to secret page'
//     })
// })

router.get('/user/:username', publicProfile); //public profile
router.put('/user/update', requireSignin, authMiddleware, update) //updating user.  
//will need to be signed in, and authenticated in adminMiddleware so that it will be available as 'user' in the request

router.get('/user/photo/:username', photo);


module.exports = router; //exports