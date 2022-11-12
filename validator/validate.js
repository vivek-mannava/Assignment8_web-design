var passwordValidator = require('password-validator');

exports.createPostValidator = (req, res, next) => {

    req.check("email", "Email Id is Mandatory").notEmpty();
    req.check("fullname", "fullname is Mandatory").notEmpty();
    req.check("email", "Email Id Length should be between 4 and 50").isLength({
        min: 4,
        max: 150
    });
    req.check("email", "Not Valid Email").isEmail();

    req.check("password", "Password is Mandatory").notEmpty();
    req.check('password').trim().notEmpty().withMessage('Password required')
        .isLength({ min: 5, max:20 }).withMessage('Password must be minimum 8 and maximum 20 characters length')
        .matches(/(?=.*?[A-Z])/).withMessage('Password must have at least one Uppercase character')
        .matches(/(?=.*?[a-z])/).withMessage('Password must have at least one Lowercase character')
        .matches(/(?=.*?[0-9])/).withMessage('Password must have at least one Number')
        .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('Password must have at least one special character')
        .not().matches(/^$|\s+/).withMessage('White spaces are not allowed in Password');

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg);
        return res.status(400).json({ error: firstError });
    }

    next();
};