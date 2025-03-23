const joi = require('joi');
const jwt = require('jsonwebtoken');

const SignupValid = (req, res, next) => {
    try {
        const schema = joi.object({
            username: joi.string().min(3).max(20).required(),
            email: joi.string().email().messages({
                'string.email': 'Invalid email format'
            }).required(),
            password: joi.string().alphanum().min(6).required(),
            role: joi.string().required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            console.log("Validation Error:", error.details[0].message);
            return res.status(400).json({
                message: "Check your input fields",
                success: false,
                error: error.details[0].message
            });
        }

        next();
    } catch (error) {
        console.log("Error in Signup Middleware:", error);
        return res.status(500).json({
            message: "Middleware failure",
            success: false,
        });
    }
};

  module.exports = SignupValid;

//dglkdg

//dfkgj