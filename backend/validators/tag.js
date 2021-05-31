const {check} = require('express-validator');

exports.createTagValidator = [
    check.apply('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
]

