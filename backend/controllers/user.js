const User = require('../models/user');

exports.read = (req, res) => {
    //remove hashed password
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
}