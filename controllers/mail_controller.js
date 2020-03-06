require('isomorphic-fetch');
const fs = require('fs'); 
const att = require('../attachments/base64');
const parser = require('../helpers/parser');
var user_con = require('../controllers/user_controller');

exports.send_mail = async function(client, per_email, first_name, last_name, tek_email,pass){

    p = await parser.parse(first_name, last_name, tek_email, pass);

    //so you have to wait for the file to read then send it
    message = fs.readFileSync('views/Welcome_Email.html', 'utf8');

    try {
        mailMess ={
          message:{
            subject: 'Welcome to TekSynap!',
            body:{
              ContentType: 'HTML',
              Content: message
            },
            ToRecipients:[
              {
                EmailAddress:{
                  Address: per_email
                }
              }
            ],
            "attachments": [
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "teksynap-banner-logo.jpg",
                contentType: "image/jpeg",
                contentBytes: att.image
              },
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "BMS 7.8.0 Email Signature In Outlook WebApp.pdf",
                contentType: "application/pdf",
                contentBytes: att.pdf
              },
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "Change LinkedIn Background.docx",
                contentType: "application/msword",
                contentBytes: att.docx
              }
            ]
          }
        }

        //sendmail
        const result = await client
        .api('/me/sendmail')
        .version('v1.0')
        .post(mailMess);

        console.log('Welcome Email Sent');
        return true;
        
  
      } catch (err) {
        console.log('mail err');
        console.log(err);
        return false;
      }

}

