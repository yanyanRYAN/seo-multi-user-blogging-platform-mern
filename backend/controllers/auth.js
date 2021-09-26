const User = require('../models/user');
const Blog = require('../models/blog');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); //helps check if the token is expired and if its valid

const _ = require('lodash');


const { errorHandler } = require('../helpers/dbErrorHandler');

// const sgMail = require('@sendgrid/mail'); //SENDGRID_API_KEY
const { response } = require('express');
const {OAuth2Client} = require('google-auth-library');
const shortid = require('shortid');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { sendEmailWithNodemailer } = require("../helpers/email");

exports.preSignup = (req, res) => {
    const {name, email, password} = req.body;
    // find existing user
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(user) {
            return res.status(400).json({
                error: `Email is taken`
            })
        }
        // generate token using name email password
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10m'})

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account activation link - ${process.env.APP_NAME}`,
            html: `
                <h4>Please use the following link to activate your account:</h4>
                <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                <p>Link expires in 10 minutes.</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>https://nakamagarage.com</p>
            `
        };

        // sgMail.send(emailData).then(sent => {
        //     return res.json({
        //         message: `Email has been sent to ${email}.  Follow the instructions to activate your account.`
        //     });
        // });

        sendEmailWithNodemailer(req, res, emailData).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
            });
        })
    })
}

// old method before accountactivation feature
// exports.signup = (req, res) => {
    
//     User.findOne({email: req.body.email}).exec((err, user)=>{
//         if(user) { //check if user already exists by email
//             return res.status(400).json({
//                 error: 'Email is already taken.'
//             })
//         }

//         const {name, email, password} = req.body;
//         let username = shortId.generate(); //generate unique short id's
//         let profile = `${process.env.CLIENT_URL}/profile/${username}` //domain.name/profile/username

//         let newUser = new User({name, email, password, profile, username});
//         newUser.save((err, success)=>{
//             if(err){
//                 return res.status(400).json({
//                     error: err
//                 })
//             }
            
//             //for testing purposes only... user that is created
//             // res.json({
//             //     user: success
//             // })

//             //for later- this is what should return on successful signin
//             res.json({
//                 message: 'Signup success! Please signin.'
//             })
//         })
//     })
// };

//Signup with account activation
exports.signup = (req, res) => {

    const token = req.body.token
    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if(err) {
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                })
            }
            
            const {name, email, password} = jwt.decode(token)
            //console.log(name, email, password);
            let username = shortId.generate(); //generate unique short id's
            let profile = `${process.env.CLIENT_URL}/profile/${username}` //domain.name/profile/username

            const user = new User({name, email, password, profile, username})
            user.save((err,user) => {
                if(err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    })
                }
                
                return res.json({
                    message: 'Signup success! Please signin.'
                })
            })
        })
    } else {
        return res.json({
            message: 'Something went wrong. Try again'
        })
    }
    
   
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
    secret: process.env.JWT_SECRET, //this will be available as req.user its also in the .env file which can be anything
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

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug}).exec((err,data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString()
        if(!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            })
        }
        next()// <-- this makes it a middleware which means go to the next step in the route call
    })
}

exports.forgotPassword = (req, res) => {
    //grab email
    const {email} = req.body;
    console.log(email);
    //find user by email
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist'
            })
        }

        //generate token
        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'})

        // send email with this token in the link
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password Reset Link - ${process.env.APP_NAME}`,
            html: `
                <h4>Please use the following link to reset your password:</h4>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <p>Link expires in 10 minutes.</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>https://nakamagarage.com</p>
            `
        };


        // populating the db with user resetPasswordLink
        return User.updateOne({resetPasswordLink: token}, (err, success) => {
            if(err) {
                return res.json({error: errorHandler(err)})
            } else {
                // sgMail.send(emailData).then(sent => {
                //     return res.json({
                //         message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 minutes.`
                //     })
                // }).catch((error) => {
                //     console.log(error.response.body)
                // })
                sendEmailWithNodemailer(req, res, emailData).then(sent => {
                        return res.json({
                            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 minutes.`
                        })
                    }).catch((error) => {
                        console.log(error.response.body)
                    })
            }
        })
    })


}

exports.resetPassword = (req, res) => {
    // grab reset password link and new password from client
    const {resetPasswordLink, newPassword} = req.body

    //find user based on reset password link
    if(resetPasswordLink) {
        //verify if token expired
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if(err){
                return res.status(401).json({
                    error: 'Expired link.  Try again'
                })
            }

            User.findOne({resetPasswordLink}, (err,user) => {
                if(err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong. Try again later'
                    })
                }
                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updatedFields)

                user.save((err,result) => {
                    if(err){
                        return response.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                })
                res.json({
                    message: 'Great! Now you can login with your new password.'
                })
            } )
        })
    }
}
//Google Client Login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req, res) => {
    //send id token from client side
    const idToken = req.body.tokenId

    //verify using client
    client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID}).then(response => {
        console.log(response)
        const {email_verified, name, email, jti} = response.payload  //jti is a unique id which could be used to create password.
        if(email_verified) {
            User.findOne({email}).exec((err, user) => {
                if(user){
                    //if user already exists
                    //console.log(user)

                    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
                    res.cookie('token', token, {expiresIn: '1d'})
                    const {_id, email, name, role, username} = user;
                    return res.json({token, user: {_id, email, name, role, username}})
                } else {
                    //create the user

                    let username = shortid.generate()
                    let profile = `${process.env.CLIENT_URL}/profile/${username}`
                    let password = jti + process.env.JWT_SECRET  //jti is a unique id that google creates so we use it as a password 
                    user = new User({name, email, profile, username, password})
                    user.save((err, data) => {
                        if(err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        }
                        const token = jwt.sign({_id: data._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
                        res.cookie('token', token, {expiresIn: '1d'})
                        const {_id, email, name, role, username} = data;
                        return res.json({token, user: {_id, email, name, role, username}})
                    })
                }
            })
        } else {
            return res.status(400).json({
                error: 'Google login failed. Try again.'
            })
        }
    })

}