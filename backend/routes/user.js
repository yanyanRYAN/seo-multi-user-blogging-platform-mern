const express = require('express');
const router = express.Router();
const {  requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth.js');
const { read, publicProfile } = require('../controllers/user');


router.get('/profile', requireSignin, adminMiddleware, read); //private profile
//test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         message: 'you have access to secret page'
//     })
// })

router.get('/user/:username', publicProfile); //public profile



module.exports = router; //exports