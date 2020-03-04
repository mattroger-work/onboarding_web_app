const generator = require('generate-password');

exports.gen = function(){
    password = generator.generate({
        length: 10,
        numbers: true,
        uppercase: true,
        symbols: true
    });

    console.log('The user password is: ' + password)
    return password;

}