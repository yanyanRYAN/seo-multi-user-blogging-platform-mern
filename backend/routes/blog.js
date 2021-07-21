const express = require('express');
const router = express.Router();
//const { create } = require('../controllers/blog.js');

const {  requireSignin, adminMiddleware } = require('../controllers/auth.js');

const {create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated} = require('../controllers/blog')

router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
//rendering blogs + categories + tags we will also be passing in some queries
// using pagenation 
//which is why its a post 
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags); 
router.get('/blog/:slug', read);
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.get('/blog/photo/:slug', photo)
router.post('/blogs/related', listRelated);

module.exports = router; //exports