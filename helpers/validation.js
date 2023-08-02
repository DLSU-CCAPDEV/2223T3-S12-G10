

// import module `check` from `express-validator`
const { check } = require('express-validator');

/*
    defines an object which contains functions
    which returns array of validation middlewares
*/
const validation = {
 
    /*
        function which returns an array of validation middlewares
        called when the client sends an HTTP POST request for `/signup`
    */
    signupValidation: function () {
        console.log('checj');

        /*
            object `validation` is an array of validation middlewares.
            the first parameter in method check() is the field to check
            the second parameter in method check() is the error message
            to be displayed when the value to the parameter fails
            the validation 
        */
        var validation = [
            check('confirm_password', 'Confirm Password is required.')
                .exists()
                .custom((value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error('Password confirmation does not match password');
                    }
                // Indicates the success of this synchronous custom validator
                return true;
                }),

            check('password', 'Password should contain at least 8 characters.')
                .isLength({min: 8})
            

        ];

        //console.log(validation);
        return validation;
    }
}

/*
    exports the object `validation` (defined above)
    when another script exports from this file
*/
module.exports = validation;
