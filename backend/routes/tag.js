const express = require('express');
const router = express.Router();

const { create, read, remove, list} = require('../controllers/tag');

// validators
const {runValidation} = require('../validators');
const {createTagValidator} = require('../validators/tag');
const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/tag', requireSignin, adminMiddleware, createTagValidator, runValidation, create );
//only admin should be able to create new tag

router.get('/tags', list)
router.get('/tag/:slug', read)
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove) //delete tag


module.exports = router; //exports

