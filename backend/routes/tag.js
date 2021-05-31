const express = require('express');
const router = express.Router();

const { create, read, remove, list} = require('../controllers/tag');

// validators
const {runValidation} = require('../validators');
const {createTagValidator} = require('../validators/tag');
const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/tag', createTagValidator, runValidation, requireSignin, adminMiddleware, create );
//only admin should be able to create new category

router.get('/tags', list)
router.get('/tags/:slug', read)
router.delete('/tags/:slug', requireSignin, adminMiddleware, remove) //delete category


module.exports = router; //exports

