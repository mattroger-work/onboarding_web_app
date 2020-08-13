/*So to send a file size greater than 3mb you must create a upload session but to send that file along with the message
you must first create the message get it's id then send it*/

require('isomorphic-fetch');
const parser = require('../../helpers/parser');
var user_con = require('../user_controller');
const fs = require('fs');
const att = require('../../attachments/base64_hr');

async function create_mail(user_name, user_email, user_title, user_phone, per_email, client){
//this function will create the message and get it' id
  
  p = await parser.parse_hr(user_name, user_email, user_title, user_phone)

  //so you have to wait for the file to read then send it
  message = fs.readFileSync('views/hr/hr_welcome_Email.html', 'utf8');

try{
    message = { 
      subject: 'Welcome to TekSynap!',
      body:{
        contentType: 'HTML',
        content: message
      },
      toRecipients:[
        {
          emailAddress:{
              //change to per_email
            address: "matt.roger@teksynap.com"
          }
        }
      ]
    };

  var result = await client
  .api('/me/messages')
  .version('beta')
  .post(message);

    
  return await result.id;

  }catch(err){
    console.log('mail creation err');
    console.log(err);
    return false;
  }
}

exports.send_mail = async function(client, per_email){
    user = await user_con.get_me(client);

    user_name = user.displayName;
    user_email = user.mail;
    user_title = user.jobTitle;
    user_phone = user.mobilePhone;

    message_id = await create_mail(user_name, user_email, user_title, user_phone, per_email, client)
    console.log('message id:'+ message_id)

    try {
        console.log('/me/messages/'+message_id+'/send')
        //sendmail
        const result = await client
        .api('/me/messages/'+message_id+'/send')
        .version('beta')
        .post();

        console.log('Welcome Email Sent');
        return true;
        
  
      } catch (err) {
        console.log('mail err');
        console.log(err);
        return false;
      }

}

async function create_upload_session(client, message_id){

  const uploadSession = {
    AttachmentItem: {
      attachmentType: "file",
      name: "hr_powerpoint",
      size: 16000
    }
  };

  var result = await client
    .api('/me/messages/'+message_id+'/attachments/createUploadSession')
	  .version('beta')
    .post(uploadSession);
    
  return result.uploadUrl;

}

function upload_to_session(client, message_id){

  uploadUrl = create_upload_session(client, message_id);



}