const express = require('express');
const router = express.Router();
//const { create } = require('../controllers/blog.js');

const {  requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth.js');

const {create, 
    list, 
    listAllBlogsCategoriesTags, 
    read, 
    remove, 
    update, 
    photo, 
    listRelated, 
    listSearch, 
    listByUser} = require('../controllers/blog')

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

router.get('/blogs/search', listSearch)

// auth user blog crud
router.post('/user/blog', requireSignin, authMiddleware, create);
router.get('/:username/blogs', listByUser);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);

module.exports = router; //exports