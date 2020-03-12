const auth_con = require("./auth_controller");

exports.render_create_sharepoint = async function(req, res){
    let params = { title: 'HQ Onboarding Tracker', active: { create: true }};
    cookies = req.cookies;
    
    client = await auth_con.get_client(res, cookies);
    if(client != false){
      res.render('sharepoint_form', params);
    }
}