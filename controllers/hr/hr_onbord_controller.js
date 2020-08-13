const auth_con = require("../auth_controller");
const share_con = require("./hr_sharepoint_controller");
const mail_con = require('../hr/hr_mail_controller');

exports.render_get = async function(req, res){
    let params = { title: 'HR Onboarding Tracker', active: { hr: true }};
    cookies = req.cookies;
    client = await auth_con.get_client(res, cookies);
    
    if(client != false){
      res.render('hr/hr_onboarding', params);
    }
}

exports.get_hq_onboardings = async function(req, res){
  cookies = req.cookies;
  client = await auth_con.get_client(res, cookies);
  result = await share_con.get_hq_onboardings(client);

  res.send(result);
}

exports.onboard = async function(req, res){
  var per_email = req.per_email;
  var cookies = req.cookies;
  client = await auth_con.get_client(res, cookies);
  result = await mail_con.send_mail(client, per_email);

  data = result ? 'Mail Sent' : 'Error on Mail';

  res.send(data);
  
}