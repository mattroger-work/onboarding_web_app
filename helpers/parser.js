const fs = require('fs');
const rep = require('replace-in-file');
const newFile = 'views/Welcome_Email.html';
var path = require('path');
const newFile_Full = path.resolve(__dirname, '../views/Welcome_Email.html');


//PASRES THE HTML TEMPLATE AND EDITS IT SO IT HAS ALL THE INFO NEEDED
exports.parse = async function(fName, lName, email, pass){
    console.log('password is ' + pass);
    const htmlFile = fs.readFileSync('views/Welcome_Email_temp.html', 'utf8');
    fs.writeFileSync(newFile, htmlFile, 'utf8');

    sign = 'https://www.teksynap.com/teksynap_signatures/' + fName + '_' + lName + '/' 

    name_change = {
        files: newFile_Full,
        from: '<span id="firstName"></span>',
        to: fName
    };

    email_change = {
        files: newFile_Full,
        from: '<span id="email"></span>',
        to: email
    }

    password_change = {
        files: newFile_Full,
        from: '<span id="password"></span>',
        to: pass
    }

    sign_change = {
        files: newFile_Full,
        from: '<span id="signature"></span>',
        to: sign
    }

    rep.sync(name_change);
    rep.sync(email_change);
    rep.sync(password_change);
    rep.sync(sign_change);

    //EDITS THE CREATED_USERS JSON FILE WITH THE NEWEST USER CREATED
    obj = {first_name: fName, last_name: lName, email: email};

    fs.writeFileSync('created_users.json', JSON.stringify(obj), (err)=>{
        console.log('json user created');
    });
}


