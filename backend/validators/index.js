const {validationResult} = require('express-validator');


exports.runValidation = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({error: errors.array()[0].msg});
    }
    next(); //if there are no errors itll just go to the next function in the route
}