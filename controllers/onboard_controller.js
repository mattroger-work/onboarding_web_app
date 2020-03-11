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

  exports.complete_onboarding = async function(req, res, next){
    //get req vars
    const first_name = req.body.first_name;
    const per_email = req.body.per_email;
    const last_name = req.body.last_name;
    const tek_email = req.body.tek_email;
    const share_id = req.body.share_id;
    const licenses = req.body.licenses;

    const pass = pass_gen.gen();

    client = await auth_con.get_client(res, cookies);
    
      succ = await share_con.onboard_person(client, share_id); //works
      if(succ){
        succ = false;
        succ = await mail_con.send_mail(client, per_email, first_name, last_name, tek_email, pass); //works
        if(succ){
          succ = false;
          succ = await user_con.set_usage_location(client, tek_email); //works
          if(succ){
            succ = false;
            succ = await lic_con.assign_licenses(client, licenses, tek_email); //works
            if(succ){
              succ = false;
              succ = await grou_con.assign_groups(client, tek_email); //works
              if(succ){
                await user_con.reset_password(client, tek_email, pass); //hmmmmmmm idk
                res.send('Complete');
              }
            }
          }
        }
      }
  }

  exports.render_get = async function(req, res, next){
    let params = { title: 'HQ Onboarding Tracker', active: { onboard: true }};

    res.render('hq_onboard_tracker', params);
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

    client = await auth_con.get_client(res, cookies);
    share_con.get_sub_onboardings(client, res);
  }