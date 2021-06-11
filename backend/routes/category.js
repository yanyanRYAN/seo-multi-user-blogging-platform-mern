const express = require('express');

const router = express.Router();
const { create, list, read, remove  } = require('../controllers/category');

// validators
const {runValidation} = require('../validators'); //since it is named index.js you just need the dir
const {categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/category', requireSignin, adminMiddleware, categoryCreateValidator, runValidation,  create)
//only admin should be able to create new category

router.get('/categories', list)
router.get('/category/:slug', read) // getting single category using request.params
router.delete('/category/:slug', requireSignin, adminMiddleware, remove) //delete category...admin only

//router.get('/profile', requireSignin, adminMiddleware, read);
//test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         message: 'you have access to secret page'
//     })
// })

module.exports = router; //exports