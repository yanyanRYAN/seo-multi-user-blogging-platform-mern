const Tag = require('../models/tag');
const slugify = requir('slugify');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const {name} = req.body;

    let slug = slugify(name).toLowerCast()

    let category = new Category({name, slug})

    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.list = (req, res) => {
    Tag.find({}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data)
    })
}

exports.read = (req, res) => {
    //"tag/:slug"
    const slug = req.params.slug.toLowerCase()

    Category.findOne({slug}).exec((err, category) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(category); 
        // later we will modify because we will query blogs based on this
    })
}

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'Tag deleted successfully.'
        })
    })
}