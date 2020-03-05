var auth_helper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const fs = require('fs'); 
const att = require('../attachments/base64');
const parser = require('../helpers/parser');
var pass_gen = require('../helpers/password');
var user_con = require('../controllers/user_controller');





exports.send_mail = async function(req, res, next) {
    var pass = pass_gen.gen();
    let params = { title: 'Send Mail', active: { mail: true } };
  
    const accessToken = await auth_helper.getAccessToken(req.cookies, res);
    const userName = req.cookies.graph_user_name;
  
    if (accessToken && userName) {
      params.user = userName;
  
      // Initialize Graph client
      const client = graph.Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        }
      });

      await user_con.reset_password(req, res, req.body.tek_email, pass)
      p = await parser.parse(req.body.fName, req.body.title, req.body.tek_email, pass);

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
                  Address: req.body.pEmail
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

        res.send(result).status('200');
        console.log('Welcome Email Sent');
  
      } catch (err) {
        console.log('mail err');
        console.log(err);
      }
  
    } else {
      // Redirect to home
      res.redirect('/');
    }
  }
