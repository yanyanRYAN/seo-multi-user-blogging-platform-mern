const User = require('../models/user');
const Blog = require('../models/blog');
const _ = require('lodash');
const formidable = require('formidable'); // handle formdata for photo upload
const fs = require('fs'); //get filesystem from nodejs
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.read = (req, res) => {
    //remove hashed password
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};

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
};

exports.update = (req, res) => {
    console.log(req.profile);
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    //form should be expecting an  fields, and or files aside from if there is err
    form.parse(req, (err, fields, files) => {
        console.log("exports.update")
        
        if(err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            })
        }

        let user = req.profile // the authmiddleware will have user available in the request profile object
        // this takes 2 args, the user it self and extend with the fields
        // if there are any fields that have been updated then it will merge the changes with 
        // the existing field.  lodash is used so that it will keep the names consistant.
        user = _.extend(user, fields) 
        console.log("fields", fields)
        console.log("fields.photo", files.photo);
        console.log(user.photo)

        if(fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: 'Password should be min 6 characters long'
            })
        }
        
        //im retarded i initally checked for fields.photo...
        if(files.photo) {
            console.log("has a photo")
            console.log("has a photo", files.photo);
            if(files.photo.size > 3000000) { //3MB = 3000000bytes
                return res.status(400).json({
                    error: 'Image should be less than 3MB'
                })
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;

        }
        user.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            //hide hashed password from return object
            user.hashed_password = undefined
            user.salt = undefined
            user.photo = undefined //this fixes the QuotaExceededError in localstorage image is 
            //pretty big and we dont want to send it back reguardless its expensive
            res.json(user);
        })
    })
}

exports.photo = (req, res) => {
    const username = req.params.username;

    User.findOne({username}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if(user.photo.data) {
            res.set('Content-Type', user.photo.contentType)
            return res.send(user.photo.data)
        }
    })


}