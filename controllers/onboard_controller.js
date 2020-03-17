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

    const pass = pass_gen.gen();

    //where is this calling cookies from?
    client = await auth_con.get_client(res, cookies);
    
      succ = await share_con.onboard_person(client, share_id); //works
      res.send('AD and Welcome Email Check');
      if(succ){
        succ = false;
        succ = await mail_con.send_mail(client, per_email, first_name, last_name, tek_email, pass); //works
        result = succ ? 'Welcome Email Sent' : 'Ended on Welcome Email';
        res.send(result);
        if(succ){
          succ = false;
          succ = await user_con.set_usage_location(client, tek_email); //works
          result = succ ? 'Usage Location set to US' : 'Ended on Usage Location';
          res.send(result);
          if(succ){
            succ = false;
            succ = await lic_con.assign_licenses(client, licenses, tek_email); //works
            result = succ ? 'Licenses Assigned' : 'Ended on License Assignment';
            res.send(result);
            if(succ){
              succ = false;
              succ = await grou_con.assign_groups(client, tek_email); //works
              result = succ ? 'Groups Assigned' : 'Ended on Group Assignment';
              res.send(result);
              if(succ){
                await user_con.reset_password(client, tek_email, pass); //hmmmmmmm idk
                result = succ ? 'User Password Reset' : 'Ended on Password Reset';
                res.send(result);
                res.send('Onboarding Complete');
                logger.log_action(req.cookies.graph_user_name,'Completed Onboarding: '+tek_email);
              }
            }
          }
        }
      }
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