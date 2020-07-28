var auth_helper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const mail_con = require('../controllers/mail_controller');
const share_con = require('../controllers/sharepoint_controller');
const grou_con = require('../controllers/group_controller');
const lic_con = require('../controllers/license_controller');
const pass_gen = require('../helpers/password');
const user_con = require('../controllers/user_controller');
const auth_con = require('../controllers/auth_controller');
const logger = require("../helpers/logger");

  exports.complete_onboarding = async function(req, res, next){
    //get req vars
    const first_name = req.body.first_name;
    const per_email = req.body.per_email;
    const last_name = req.body.last_name;
    const tek_email = req.body.tek_email;
    const share_id = req.body.share_id;
    const licenses = req.body.licenses;
    const cookies = req.cookies;

    const pass = pass_gen.gen();

    //where is this calling cookies from?
    client = await auth_con.get_client(res, cookies);
    
    
      succ = false;
      succ = await user_con.set_usage_location(client, tek_email); //works
      result = succ ? 'Usage Location set to US' : 'Ended on Usage Location';
      if(succ){
        succ = false;
        succ = await lic_con.assign_licenses(client, licenses, tek_email); //works
        result += succ ? '\nLicenses Assigned' : '\nEnded on License Assignment';
        await console.log("licenses: "+succ)
        if(succ){
          succ = false;
          succ = await grou_con.assign_groups(client, tek_email); //works
          result += succ ? '\nGroups Assigned' : '\nEnded on Group Assignment';
          if(succ){
            succ = await share_con.onboard_person(client, share_id); //works
            result += succ ? '\nSharepoint Check' : '\nEnded on sharepoint check'
            if(succ){
              succ = false;
              succ = await mail_con.send_mail(client, per_email, first_name, last_name, tek_email, pass); //works
              result += succ ? '\nWelcome Email Sent' : '\nEnded on Welcome Email';
              if(succ){
                await user_con.reset_password(client, tek_email, pass); //hmmmmmmm idk
                result += succ ? '\nUser Password Reset' : '\nEnded on Password Reset';
                result += '\nOnboarding Complete';
                logger.log_action(req.cookies.graph_user_name,'Completed Onboarding: '+tek_email);
              }
            }
          }
        }
      }
      res.send(result);
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

    var amount = 10;
    if(req.query.amount){
      amount = req.query.amount;
    }

    client = await auth_con.get_client(res, cookies);
    result = await share_con.get_hq_onboardings(client, amount);
    res.json(result);
  }

  exports.get_sub_onboardings = async function(req, res, next){
    cookies = req.cookies;

    var amount = 10;
    if(req.query.amount){
      amount = req.query.amount;
    }

    client = await auth_con.get_client(res, cookies);
    result = await share_con.get_sub_onboardings(client, amount);
    res.json(result);
  }