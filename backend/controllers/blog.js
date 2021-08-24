const Blog = require('../models/blog')
const Category = require('../models/category')
const Tag = require('../models/tag');
const User = require('../models/user');
const formidable = require('formidable') //handle form data, we will not be dealing with json data with blogs since we are transfering files
const slugify = require('slugify')
const { stripHtml } = require('string-strip-html') //Allow us to strip out html, 
// to create excerpts out of the blog content. blog will be created with a rich text editor which will give us h1 h2 p ,etc
const _ = require('lodash')// lib to update blog
const { errorHandler } = require('../helpers/dbErrorHandler'); //send any error from mongoose to our client
const fs = require('fs') // gives access to the file system
const { smartTrim } = require('../helpers/blog');

exports.create = (req, res) => {

    //handle form data
    let form = new formidable.IncomingForm()
    //console.log(form)
    form.keepExtensions = true // keeping original extensions .jpg, .gif, etc
    //parse data -- takes in request and callback that expects err, fields, or files
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }
        //get fields from form data
        const { title, body, categories, tags } = fields;

        //Validations
        if (!title || !title.length) {
            return res.status(400).json({
                error: 'Title is required'
            })
        }

        if (!body || body.length < 100) {
            return res.status(400).json({
                error: 'Content is too short'
            })
        }

        if (!categories || !categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            })
        }

        if (!tags || !tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            })
        }

        //for excerpt
        let cleanText = body.replace(/<\/?[^>]+(>|$)/g, "");
        //console.log("CleanText", cleanText);

        let blog = new Blog()
        blog.title = title
        blog.body = body
        blog.excerpt = smartTrim(cleanText, 320, ' ', ' ...');
        blog.slug = slugify(title).toLowerCase()
        blog.mtitle = `${title} | ${process.env.APP_NAME}`
        blog.mdesc = stripHtml(body.substring(0, 160)).result // .result - refer to striphtml docs
        blog.postedBy = req.user._id

        //create the blog first then sync the categories and tags

        //categories and tags
        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',')

        console.log("photo blog", files.photo);
        //handle files
        if (files.photo) {
            if (files.photo.size > 40000000) { //4MB was originally 1MB
                return res.status(400).json({
                    error: 'Image should be less than 1MB in size'
                });
            }
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type
        }

        blog.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            //res.json(result);
            // use result._id to find the blog again then push the categories + tags to the blog
            Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                } else {
                    //Add the tags to the blog
                    Blog.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        } else {
                            //finally return the blog with the categories and tags
                            // console.log("Form before result")
                            // console.log(form)
                            res.json(result)
                        }
                    })
                }
            })
        })

    })

};

//list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req, res) => {
    //want to find blogs and send associated categories, tags, user with their fields
    Blog.find({})
        .populate('categories', '_id name slug') //('what you want', 'fields') fields have no comma separation
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')//selecting what to return. we dont want photos right now, too slow
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.listAllBlogsCategoriesTags = (req, res) => {
    //basically same as list but will also return Categories and Tags

    //set limit for how many is returned for each request
    //comes from front end. ex: user wants  10, 15 blogs for pagenation
    // default is 10 blogs
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate('categories', '_id name slug') //('what you want', 'fields') fields have no comma separation
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 }) //returns the latest first
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            blogs = data // blogs
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    })
                }
                categories = c //categories
                //get all tags
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        })
                    }
                    tags = t

                    //return all blogs categories tags
                    // size how many blogs will be sent to front end
                    res.json({ blogs, categories, tags, size: blogs.length })
                })
            })

        })

}

exports.read = (req, res) => {
    //get slug
    const slug = req.params.slug.toLowerCase() //make sure its lowercase

    Blog.findOne({ slug })
        //.select('-photo')
        .populate('categories', '_id name slug') //('what you want', 'fields') fields have no comma separation
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title body slug mtitle mdesc categories excerpt tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data);
        })
}

exports.remove = (req, res) => {
    //get slug
    const slug = req.params.slug.toLowerCase() //make sure its lowercase

    Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'Blog deleted successfully'
        })
    })
}

exports.update = (req, res) => {
    //similar to blog create

    //get slug
    const slug = req.params.slug.toLowerCase() //make sure its lowercase

    Blog.findOne({ slug }).exec((err, oldBlog) => { //consider the data an old blog since we will update it
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        //handle form data
        let form = new formidable.IncomingForm();
        //console.log(form)
        form.keepExtensions = true // keeping original extensions .jpg, .gif, etc

        //parse data -- takes in request and callback that expects err, fields, or files
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                })
            }


            // even if the user updates the title, the slug shouldn't change

            let slugBeforeMerge = oldBlog.slug
            oldBlog = _.merge(oldBlog, fields) //merge oldblog with new fields
            oldBlog.slug = slugBeforeMerge


            const { body, desc, categories, tags } = fields



            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...') //if body has changed we update the excerpt
                oldBlog.desc = stripHtml(body.substring(0, 160))
            }

            if (categories) {
                //if categories are added it will create an array
                oldBlog.categories = categories.split(',')
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }



            //handle files
            if (files.photo) {
                if (files.photo.size > 40000000) { //4MB was originally 1MB
                    return res.status(400).json({
                        error: 'Image should be less than 1MB in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path)
                oldBlog.photo.contentType = files.photo.type
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined //we can send result without photo
                res.json(result); //updated blog


            })

        })
    })

}


exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            //console.log(`Content-Type: ${blog.photo.contentType}`);
            res.set('Content-Type', blog.photo.contentType)
            return res.send(blog.photo.data);
        })
}

exports.listRelated = (req, res) => {
    //not req.limit we have to use req.body because it is a post
    let limit = req.body.limit ? parseInt(req.body.limit ) : 3

    //grab ids and categories from the blog in the req
    //since we use post we will be able to grab the blog
    const{_id, categories} = req.body.blog

    Blog.find({_id: {$ne: _id}, categories: {$in: categories}})
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('postedBy', '_id name username profile')
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec((err, blogs) => {
        if(err) {
            return res.status(400).json({
                error: 'Blogs not found'
            });
            
        }
        res.json(blogs)
    })


}

//
exports.listSearch = (req, res) => {
    console.log(req.query)
    const {search} = req.query;
    if(search) {
        Blog.find({
            $or: [{title: {$regex: search, $options: 'i'}}, {body: {$regex: search, $options: 'i'}}]
        }, (err, blogs) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(blogs)
        }).select('-photo -body');
    }
}

exports.listByUser = (req, res) => {
    //find user
    User.findOne({username: req.params.username}).exec((err, user) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        //find blogs by user id
        let userId = user._id
        Blog.find({postedBy: userId})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .sort({ createdAt: -1 }) 
            .select('_id title slug postedBy createdAt updatedAt')
            .exec((err, data) => {
                if(err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json(data)
            })
    })
}