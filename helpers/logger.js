//these functions haven't been working so I just commented them out.

const fs = require('fs');

async function check_dir(){
    if(fs.existsSync('logs')){
        return true;
    }else{
        return false
    }
}
async function check_file(file){
    if(fs.existsSync(file)){
        return true;
    }else{
        return false
    }
}


exports.log_signin = async function(user_name){
    const date = new Date;
    if(check_dir()){
        if(check_file('logs/sigin.log')){
            fs.appendFile("logs/signin.log","\nSign-in:" + user_name + " Date:" + date, () =>{return null;});
        }else{
            fs.writeFile("logs/signin.log","\nSign-in:" + user_name + " Date:" + date, ()=>{return null;});
        }
    }else{
        fs.mkdir("./logs", ()=>{return null;});
        fs.writeFile("logs/signin.log","\nSign-in:" + user_name + " Date:" + date, ()=>{return null;});
    }
}

  exports.log_action = async function(user_name, action){
      const date = new Date;
      if(check_dir()){
          if(check_file('logs/actions.log')){
              fs.appendFile("logs/actions.log","\nAction:"+user_name+" Date:"+date+" Action:"+action, () =>{return null;})
          }else{
            fs.writeFile("logs/actions.log","\nAction:"+user_name+" Date:"+date+" Action:"+action, ()=>{return null;});
          }
      }else{
        fs.mkdir("./logs", ()=>{return null;});
        fs.writeFile("logs/actions.log","\nAction:"+user_name+" Date:"+date+" Action:"+action, ()=>{return null;});
      }
  }