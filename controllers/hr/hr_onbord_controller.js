const auth_con = require("../auth_controller");
const share_con = require("./hr_sharepoint_controller");

exports.render_hello = async function(req, res){
    let params = { title: 'HR Onboarding Tracker', active: { create: true }};
    cookies = req.cookies;
    client = await auth_con.get_client(res, cookies);
    share_data = await share_con.get_hq_onboardings(client);

    
    if(client != false){
      //res.render('hr/hr_onboarding', params);
      res.send(share_data);
    }
}