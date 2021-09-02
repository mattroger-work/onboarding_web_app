const generator = require('generate-password');

//THIS FUNCTION GENERATES A PASSWORD WITHIN THE COMPANIES POLICIES PRINTS IT AND RETURNS
exports.gen = function(){
    password = generator.generate({
        length: 10,
        numbers: true,
        uppercase: true,
        symbols: false
    });

    console.log('The user password is: ' + password)
    return password;

}