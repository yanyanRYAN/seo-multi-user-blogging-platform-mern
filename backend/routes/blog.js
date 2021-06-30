const express = require('express');
const router = express.Router();
const { create } = require('../controllers/blog.js');

const {  requireSignin, adminMiddleware } = require('../controllers/auth.js');

router.post('/blog', requireSignin, adminMiddleware, create);


module.exports = router; //exports