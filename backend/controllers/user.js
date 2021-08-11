const User = require('../models/user');
const Blog = require('../models/blog');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.read = (req, res) => {
    //remove hashed password
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
}

exports.publicProfile = (req, res) => {
    //need to get profile name and make query to database
    let username = req.params.username;
    console.log(username)
    let user  //plan to query and return as json response
    let blogs //plan to query and return as json response

    //find user
    User.findOne({username}).exec((err, userFromDB) => {
        if( err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        user = userFromDB
        let userId = user._id

        //now find blog
        Blog.find({postedBy: userId})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .limit(10)
        .sort({ createdAt: -1 }) //returns the latest first
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            user.photo = undefined;
            user.hashed_password = undefined; 

            res.json({ user, blogs: data})
        })
    })
}