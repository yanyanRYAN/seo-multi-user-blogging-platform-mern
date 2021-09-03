//for contact form

const express = require('express');

const router = express.Router();
const { contactForm, contactBlogAuthorForm  } = require('../controllers/form');

// validators
const {runValidation} = require('../validators'); //since it is named index.js you just need the dir
const {contactFormValidator } = require('../validators/form');


router.post('/contact', contactFormValidator, runValidation, contactForm)
router.post('/contact-blog-author', contactFormValidator, runValidation, contactBlogAuthorForm)


module.exports = router; //exports