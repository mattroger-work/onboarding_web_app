require('isomorphic-fetch');
const fs = require('fs'); 
const att = require('../attachments/base64');
const att_sub = require('../attachments/base64_sub');
const parser = require('../helpers/parser');
var user_con = require('../controllers/user_controller');

exports.send_mail = async function(client, per_email, first_name, last_name, tek_email,pass){

    user = await user_con.get_me(client);
    user_name = user.displayName;
    user_email = user.mail;
    user_title = user.jobTitle;
    user_phone = user.mobilePhone;

    p = await parser.parse(first_name, last_name, tek_email, pass, user_name, user_email, user_title, user_phone);
    //await parser.parse_sign(user_name, user_email, user_title, user_phone);

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
              },
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "Accessing Microsoft Partner University.pdf",
                contentType: "application/pdf",
                contentBytes: att.pdf_msPartner
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

exports.send_mail_sub = async function(client, per_email, first_name, last_name, pass){
  user = await user_con.get_me(client);
    user_name = user.displayName;
    user_email = user.mail;
    user_title = user.jobTitle;
    user_phone = user.mobilePhone;

  p = await parser.parse_sub(first_name, last_name, pass, user_name, user_email, user_title, user_phone);


    message = fs.readFileSync('views/welcome_email_sub.html', 'utf8');

    try {
        mailMess ={
          message:{
            //change
            subject: 'TekSynap Time and Expense',
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
            //change must also add to the b64 file
            "attachments": [
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "BMS 4.7.6 Timesheet Instructions.pdf",
                contentType: "application/pdf",
                contentBytes: att_sub.timesheet
              },
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "Subcontractor Login To Unanet Cloud.pdf",
                contentType: "application/pdf",
                contentBytes: att_sub.login
              },
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "Subcontractor Password Reset.pdf",
                contentType: "application/pdf",
                contentBytes: att_sub.pass_reset
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
