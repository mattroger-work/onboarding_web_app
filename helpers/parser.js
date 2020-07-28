const fs = require('fs');
const rep = require('replace-in-file');
const path = require('path');


//PASRES THE HTML TEMPLATE AND EDITS IT SO IT HAS ALL THE INFO NEEDED
exports.parse = async function(fName, lName, email, pass, user_name, user_email, user_title, user_phone){
    var newFile = 'views/Welcome_Email.html';
    var newFile_Full = path.resolve(__dirname, '../views/Welcome_Email.html');
    const htmlFile = fs.readFileSync('views/Welcome_Email_temp.html', 'utf8');
    fs.writeFileSync(newFile, htmlFile, 'utf8');

    sign = 'https://www.teksynap.com/teksynap_signatures/' + fName + '_' + lName + '/' 
//-----------------------------------------------------------welcome edit
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
//--------------------------------------------------------------sign edit
    user_name_change = {
        files: newFile_Full,
        from: '<span id="user_name" style="color: #002a7f; font-weight: bold; font-size: 14px;"></span>',
        to: '<span id="user_name" style="color: #002a7f; font-weight: bold; font-size: 14px;">'+user_name+'</span>'
    }
    user_email_change = {
        files: newFile_Full,
        from:'<a id="user_email" style="color: #002a7f !important; text-decoration: none !important;" title="Email Matt Roger" href="mailto:Matt.Roger@teksynap.com">Matt.Roger@teksynap.com</a>',
        to:'<a id="user_email" style="color: #002a7f !important; text-decoration: none !important;" title="Email '+user_name+'" href="mailto:'+user_email+'">'+user_email+'</a>'
    }
    user_title_change = {
        files: newFile_Full,
        from:'<span id="user_title">IT Administrator</span>',
        to:'<span id="user_title">'+user_title+'</span>'
    }
    user_phone_change = {
        files: newFile_Full,
        from:'<span id="phone_number"></span>',
        to:'<span id="phone_number">'+user_phone+'</span>'
    }

    //-------------------------------------welcome email
    rep.sync(name_change);
    rep.sync(email_change);
    rep.sync(password_change);
    rep.sync(sign_change);
    //--------------------------------------user sign
    rep.sync(user_email_change);
    rep.sync(user_name_change);
    rep.sync(user_title_change);
    rep.sync(user_phone_change);

    //EDITS THE CREATED_USERS JSON FILE WITH THE NEWEST USER CREATED
    obj = {first_name: fName, last_name: lName, email: email};

    fs.writeFileSync('created_users.json', JSON.stringify(obj), (err)=>{
        console.log('json user created');
    });
}

exports.parse_sub = async function(first_name, last_name, pass, user_name, user_email, user_title, user_phone){
    var htmlFile = fs.readFileSync('views/welcome_email_sub_temp.html', 'utf8');
    var newFile = "views/welcome_email_sub.html";
    fs.writeFileSync(newFile, htmlFile, 'utf8');
     newFile_Full = path.resolve(__dirname, '../views/welcome_email_sub.html');

     name_change = {
        files: newFile_Full,
        from: '<span id="user_name"></span>',
        to: first_name + '.' + last_name + '.s@teksynap.com'
    };

    pass_change = {
        files: newFile_Full,
        from: '<span id="password"></span>',
        to: pass
    };

    //--------------------------------------------------------------sign edit
    user_name_change = {
        files: newFile_Full,
        from: '<span id="user_name" style="color: #002a7f; font-weight: bold; font-size: 14px;"></span>',
        to: '<span id="user_name" style="color: #002a7f; font-weight: bold; font-size: 14px;">'+user_name+'</span>'
    }
    user_email_change = {
        files: newFile_Full,
        from:'<a id="user_email" style="color: #002a7f !important; text-decoration: none !important;" title="Email Matt Roger" href="mailto:Matt.Roger@teksynap.com">Matt.Roger@teksynap.com</a>',
        to:'<a id="user_email" style="color: #002a7f !important; text-decoration: none !important;" title="Email '+user_name+'" href="mailto:'+user_email+'">'+user_email+'</a>'
    }
    user_title_change = {
        files: newFile_Full,
        from:'<span id="user_title">IT Administrator</span>',
        to:'<span id="user_title">'+user_title+'</span>'
    }
    user_phone_change = {
        files: newFile_Full,
        from:'<span id="phone_number"></span>',
        to:'<span id="phone_number">'+user_phone+'</span>'
    }

    rep.sync(name_change);
    rep.sync(pass_change);

    //--------------------------------------user sign
    rep.sync(user_email_change);
    rep.sync(user_name_change);
    rep.sync(user_title_change);
    rep.sync(user_phone_change);

    
}