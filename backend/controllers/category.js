const Category = require('../models/category');
const slugify = require('slugify');
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.create = (req, res) => {
    //grab category name from request body
    const {name} = req.body;
    // generate slug
    let slug = slugify(name).toLowerCase()

    let category = new Category({name, slug})

    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
        // res.json({
        //     category: data // while this is valid, youll need to access it by category.category.data
        // })
    })

}