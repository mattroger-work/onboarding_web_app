const fs = require('fs');

exports.log_signin = async function(user_name){
    const date = new Date;
    fs.appendFile("logs/signin.log","\nSign-in:" + user_name + " Date:" + date, () =>{return null;});
}

  exports.log_action = async function(user_name, action){
    const date = new Date;
    fs.appendFile("logs/actions.log","\nAction:"+user_name+" Date:"+date+" Action:"+action, () =>{return null;})
    
  }