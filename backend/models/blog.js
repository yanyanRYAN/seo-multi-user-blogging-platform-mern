const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


//user schema
const blogSchema = new mongoose.Schema({
    //160 char is standard for meta description 
    title: {
        type: String,
        trim: true,
        min: 3,
        max: 160,
        required: true
    },
    slug: {
        //will be querying blogs using slug
        type: String,
        unique: true,
        index: true,
    },
    body: {
        // type: {} empty object means you can store all kinds of data
        type: {},
        required: true,
        // blob minimum is 200kb, blog max is 2MB = 2000000
        min: 200,
        max: 2000000,
    },
    excerpt: {
        // blog snippets - grab first 100 or so chars from blog body
        type: String,
        max: 1000,
    },
    mtitle: {
        //meta title
        type: String,
    },
    mdesc: {
        //meta description
        type: String,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    //Type: ObjectId because categories will be pointing to the categories already created in another collection
    // referenced by the Model name
    categories: [{type: ObjectId, ref: 'Category', required: true}],
    tags: [{type: ObjectId, ref: 'Tag', required: true}],
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
}, {timestamps: true})



module.exports = mongoose.model('Blog', blogSchema);