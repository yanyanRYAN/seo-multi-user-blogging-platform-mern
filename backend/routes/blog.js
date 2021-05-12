const express = require('express');
const router = express.Router();
const { time } = require('../controllers/blog.js');

router.get('/', time);


module.exports = router; //exports