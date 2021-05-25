const express = require('express');
const router = express.Router();
const {  requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth.js');
const { read } = require('../controllers/user');


router.get('/profile', requireSignin, adminMiddleware, read);
//test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         message: 'you have access to secret page'
//     })
// })



module.exports = router; //exports