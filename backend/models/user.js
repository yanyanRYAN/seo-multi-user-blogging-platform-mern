const mongoose = require('mongoose');
const crypto = require('crypto');// core nodejs module used to hash password


//user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
    },
    profile: {
        type: String,
        required: true,
        lowercase: true,
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    about: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
}, {timestamps: true})

//virtual fields
// want to get password from the user, but we want to save the HASHED password
// so we take the password and modify it to be saved as a hashed password

userSchema.virtual('password')
    .set(function(password){
        //create a temporary variable called _password
        this._password = password;
        //generate salt
        this.salt = this.makeSalt();
        // encryptPassword
        this.hashed_password = this.encryptPassword(password);


    })  //use regular functions not arrow functions dont have their own scope in here
    .get(function() {
        return this._password;
    });

// these are methods that are used by these virtual fields
userSchema.methods = {
    authenticate: function (plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if(!password) return '';
        try{
            //hash the plain password use crypto
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        }catch (err){
            return ''
        }
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = mongoose.model('User', userSchema);