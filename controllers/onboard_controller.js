require('isomorphic-fetch');
const mail_con = require('../controllers/mail_controller');
const share_con = require('../controllers/sharepoint_controller');
const lic_con = require('./license_controller');
const pass_gen = require('../helpers/password');
const user_con = require('../controllers/user_controller');
const auth_con = require('../controllers/auth_controller');
const logger = require("../helpers/logger");
const group_con = require("../controllers/group_controller");

//send mail route
exports.send_mail = async function(req, res, next){
  const first_name = req.body.first_name;
  const per_email = req.body.per_email;
  const last_name = req.body.last_name;
  const tek_email = req.body.tek_email;
  const share_id = req.body.share_id;
  const cookies = req.cookies;
  var licenses = req.body.licenses
  need_equipment = true;

  const pass = pass_gen.gen();

  logger.log_action(req.cookies.graph_user_name, "Sent Mail: " + tek_email)

  client = await auth_con.get_client(res, cookies);

  user_id = await user_con.get_user(client, tek_email, true);

  //we order all of their licenses to make check if they need equipment
  equipment = await lic_con.order_licenses(licenses);
  //we check the license obj if it has an e1 that means they don't need equipment
  for(i=0; i<equipment.length; i++){
    if(equipment[i] == 'e1'){
      need_equipment = false
    }
  }
  
  //we get their password and reset their account
  result = await user_con.reset_password(client, tek_email, pass);
  if(result == true){
    //if password reset didn't fail we send out the welcome email
    result = await mail_con.send_welcome_email(client, per_email, first_name, last_name, tek_email, pass);
    if(result == true){
      if(need_equipment){
        //if they need equipment then we add the to the correct groups
        result = await group_con.add_to_windows_10_new(client, user_id);
        if(result == true){
          //if the autopilot email didn't fail we 
          result = await group_con.add_to_intune_pilot(client, user_id);
          if(result == true){
            //if the groups didn't fail then we will send out the equipment email
            result = await mail_con.send_autopilot_email(client, per_email);
          }
        }
      }
      if(result == true){
        //if welcome email or autopilot email didn't fail then we check that it was sent on sharepoint
        result = await share_con.check_welcome_letter_sent(client, share_id)
      }
    }
  }

  result = result == true ? 'Welcome Email Sent' : result;

  res.send(result);
}

exports.assign_licenses = async function(req, res, next){
    const tek_email = req.body.tek_email;
    const share_id = req.body.share_id;
    var licenses = req.body.licenses;
    const cookies = req.cookies;
    licenses = JSON.stringify(licenses)
    licenses = JSON.parse(licenses)
    
    logger.log_action(req.cookies.graph_user_name, "Assigned Licenses: " + tek_email)

    client = await auth_con.get_client(res, cookies);

    //set the user location in order to assign licenses
    result = await user_con.set_usage_location(client, tek_email);
    if(result == true){
      //set the licenses
      result = await lic_con.assign_licenses(client, licenses, tek_email);
      if(result == true){
        //marks on sharepoint the the licenses have been assigned
        await share_con.check_licenses_assigned(client, share_id)
      }
    }

    result  = result == true ? "Licences Assigned" : result;

    res.json(result)
    


}
  
  exports.complete_onboarding_sub = async function(req, res){
    const per_email = req.body.per_email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const cookies = req.cookies;
    const pass = await pass_gen.gen();

    client = await auth_con.get_client(res, cookies);
    
    succ = mail_con.send_mail_sub(client,per_email,first_name, last_name, pass);

    result = succ ? "Onboarding Completed" : "Onboarding Failed";
    logger.log_action(req.cookies.graph_user_name,'Completed Sub Onboarding: '+ first_name + '.' + last_name + '.s' + '@teksynap.com');

    res.send(result);
  }

  exports.render_hq_get = async function(req, res, next){
    let params = { title: 'HQ Onboarding Tracker', active: { onboard: true }};
    cookies = req.cookies;
    client = await auth_con.get_client(res, cookies);

    if(client != false){
      res.render('hq_onboard_tracker', params);
    }
  }

  exports.render_sub_get  = async function(req, res, next){
    let params = { title: 'Sub-Contractors Onboarding Tracker', active: { onboard: true }};
    cookies = req.cookies;
    client = await auth_con.get_client(res, cookies);

    if(client != false){
      res.render('sub_onboard_tracker', params);
    }
  }

  exports.get_hq_onboardings = async function(req, res, next){
    cookies = req.cookies;

    var amount = req.query.amount ? req.query.amount : 10;

    client = await auth_con.get_client(res, cookies);
    result = await share_con.get_hq_onboardings(client, amount);
    res.json(result);
  }

  exports.get_sub_onboardings = async function(req, res, next){
    cookies = req.cookies;

    var amount = req.query.amount ? req.query.amount : 10;

    client = await auth_con.get_client(res, cookies);
    result = await share_con.get_sub_onboardings(client, amount);
    res.json(result);
  }

  exports.create_user = async function(req, res, next){
    cookies = req.cookies;
    first_name = req.body.first_name;
    last_name = req.body.last_name;
    upn = req.body.upn;
    displayName = first_name + " " + last_name;
    mailNickName = first_name + "." + last_name;
    job_title = req.body.job_title;
    phone = req.body.phone;
    department = req.body.department;
    department = department.split(' ');
    contract = req.body.contract;
    pm_id = req.body.pm_id;
    share_id = req.body.share_id;
    pass = pass_gen.gen()

    client = await auth_con.get_client(res, cookies);

    //create the user and set basic info
    user_created = await user_con.create_user(client, displayName, mailNickName, upn, pass);
    if(user_created == true){
      //get the users id in order to update the user
      user_id = await user_con.get_user(client,upn,true);
      //enter more information not allowed in create user
      user_con.update_user(client, user_id, first_name, last_name, job_title, phone, department[0], contract);
      //get the manager email for the user information list
      manager_email = await share_con.get_manager_by_lookup_id(client, pm_id);
      //get the manager's id from the upn
      manager_id = await user_con.get_user(client, manager_email, true);
      //get the employee id
      emp_id = await user_con.get_user(client, upn, true);
      //assign the employee to a manager
      user_con.assign_manager(client,emp_id,manager_email);
      //send mail to start follow and track on support@teksynap.com
      mail_con.send_mail_create(client, first_name, last_name, upn, user_id);
      //check on sharepoint that the account has been created
      share_con.check_ad_import(client, share_id)

      logger.log_action(req.cookies.graph_user_name,'Created User: '+ first_name + "." + last_name + "@teksynap.com");

      res.json("User Created");
    }else{
      res.json(user_created)

    }
    

    
  }

  exports.create_user_sub = async function(req, res, next){
    cookies = req.cookies;
    client = await auth_con.get_client(res, cookies);
    per_email = req.body.per_email;
    first_name = req.body.first_name;
    last_name = req.body.last_name;
    position = req.body.position;
    displayName = first_name + ' ' + last_name;
    pass = pass_gen.gen();

    if(position.toUpperCase() == "CONSULTANT"){
      mailNickName = first_name+'.'+last_name+'.c';
      consultant = true;
    }else{
      mailNickName = first_name+'.'+last_name+'.s';
      consultant = false;
    }
    upn = mailNickName + '@teksynap.com';
    console.log(mailNickName)

    user_created = await user_con.create_user(client, displayName, mailNickName, upn, pass)
    if(user_created){
      user_id = await user_con.get_user(client, upn, true);
      mail_con.send_mail_create_sub(client, first_name, last_name, upn, user_id, consultant)
      logger.log_action(req.cookies.graph_user_name,'Created Sub: '+ upn);
      res.send("Sub Created")
    }else{
    res.send("Sub Already Created")
    }
  }