const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); //helps check if the token is expired and if its valid


exports.signup = (req, res) => {
    
    User.findOne({email: req.body.email}).exec((err, user)=>{
        if(user) { //check if user already exists by email
            return res.status(400).json({
                error: 'Email is already taken.'
            })
        }

        const {name, email, password} = req.body;
        let username = shortId.generate(); //generate unique short id's
        let profile = `${process.env.CLIENT_URL}/profile/${username}` //domain.name/profile/username

        let newUser = new User({name, email, password, profile, username});
        newUser.save((err, success)=>{
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            
            //for testing purposes only... user that is created
            // res.json({
            //     user: success
            // })

            //for later- this is what should return on successful signin
            res.json({
                message: 'Signup success! Please signin.'
            })
        })
    })
};

exports.signin = (req, res) => {

    const {email, password} = req.body;
    // check if user exists, if not ask to sign up
    User.findOne({email}).exec((err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist.  Please signup."
            });
        }

        // authenticate  - user's email + password should match,  
        //we will then compare password with the hashed password in db 
        // - authenticate in the schema
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match."
            });
        }


        // generate token and send to client - includes the userID and the secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'}) //creates signed token using userID, Secret, and expiration

        res.cookie('token', token, {expiresIn: '1d'});

        const {_id, username, name, email, role} = user;

        return res.json({
            token,
            user : {_id, username, name, email, role} // dont want to return salt and hash
        });

    });


};

exports.signout = (req, res) => {
    res.clearCookie("token"); //clear the cookie that was generated in signin
    res.json({
        message: 'Signout success'
    });
};

//middleware - check to incoming token's secret and 
// if it matches and token hasnt expired, this will return true
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "user"
});
//userProperty: "user"

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id
    //find user in db
    User.findById({_id: authUserId}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        // careful this will make whole 
        // user available including hashed password
        // will need another middleware to hide the password
        req.profile = user 
        next()
    })
}

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id
    //find user in db
    User.findById({_id: adminUserId}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found.'
            })
        }
        //check the role of the user to make sure they are admin
        if(user.role !== 1) { //the role of 1 means they are admin
            return res.status(400).json({
                error: 'Admin resource. Access Denied.'
            })
        }
        // careful this will make whole 
        // user available including hashed password
        // will need another middleware to hide the password
        req.profile = user
        next()
    })
}