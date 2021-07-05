const Blog = require('../models/blog')
const Category = require('../models/category')
const Tag = require('../models/tag');
const formidable = require('formidable') //handle form data, we will not be dealing with json data with blogs since we are transfering files
const slugify = require('slugify')
const { stripHtml } = require('string-strip-html') //Allow us to strip out html, 
// to create excerpts out of the blog content. blog will be created with a rich text editor which will give us h1 h2 p ,etc
const _ = require('lodash')// lib to update blog
const { errorHandler } = require('../helpers/dbErrorHandler'); //send any error from mongoose to our client
const fs = require('fs') // gives access to the file system
const {smartTrim} =  require('../helpers/blog');

exports.create = (req, res) => {

    //handle form data
    let form = new formidable.IncomingForm()
    console.log(form)
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

        let blog = new Blog()
        blog.title = title
        blog.body = body
        blog.excerpt = smartTrim(body, 320, ' ', ' ...');
        blog.slug = slugify(title).toLowerCase()
        blog.mtitle = `${title} | ${process.env.APP_NAME}`
        blog.mdesc = stripHtml(body.substring(0, 160)).result // .result - refer to striphtml docs
        blog.postedBy = req.user._id

        //create the blog first then sync the categories and tags

        //categories and tags
        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',')


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
                            res.json(result)
                        }
                    })
                }
            })
        })

    })

};

