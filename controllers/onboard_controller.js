var auth_helper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const time = require('../helpers/time');
const onboarding_id = 'synaptekcorp1.sharepoint.com,8a01d30a-1420-471d-9ecd-c82887f3084e,d6b56455-a47a-4f3e-8ccb-26af1125e45f';
const hqOnboarding_id = '/169af5d4-390e-47f2-8a86-8970695cd407';
const subOnboarding_id = '/c13b82c3-22d1-4618-81bd-03000a2c2aee';
const mail_con = require('../controllers/mail_controller');
const share_con = require('../controllers/sharepoint_controller');
const grou_con = require('../controllers/group_controller');
const lic_con = require('../controllers/license_controller');
const pass_gen = require('../helpers/password');
const user_con = require('../controllers/user_controller');

exports.get_hq_onboardings = async function(req, res, next) {
    let params = { title: 'HQ Onboarding Tracker', active: { onboard: true }};
  
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

      try{
        var amount = 10
        if(req.query.amount){
          amount = req.query.amount;
        }
        //get hq onboarding items
        const result = await client
        .api('sites/'+onboarding_id+'/lists'+hqOnboarding_id+'/items')
        .version('v1.0')
        .expand('fields')
        .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
        .filter("fields/DueDate ge " + time.get_now())
        .filter("fields/Active_x0020_Directory_x0020_Imp eq 'false'")
        .orderby('fields/DueDate')
        .top(amount)
        .get();

        params.messages = result.value;
        res.status(200);
        res.render('hq_onboard_tracker', params);

      } catch (err) {
        params.message = 'Error retrieving messages';
        params.error = { status: `${err.code}: ${err.message}` };
        params.debug = JSON.stringify(err.body, null, 2);
        res.render('error', params);
      }
  
    } else {
      // Redirect to home
      res.redirect('/');
    }
  }

  exports.get_sub_onboardings = async function(req, res, next) {
    let params = { title: 'Sub-Contractors Onboarding Tracker', active: { onboard_sub: true }};
  
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

      try{

        //get sub onboarding items
        const result = await client
        .api('sites/'+onboarding_id+'/lists'+subOnboarding_id+'/items')
        .version('v1.0')
        .expand('fields')
        .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
        .filter("fields/Start_x0020_Date ge " + time.get_now())
        .orderby('fields/Start_x0020_Date')
        .top(10)
        .get();

        params.messages = result.value;
        res.status(200);
        res.render('sub_onboard_tracker', params);

      } catch (err) {
        params.message = 'Error retrieving messages';
        params.error = { status: `${err.code}: ${err.message}` };
        params.debug = JSON.stringify(err.body, null, 2);
        res.render('error', params);
      }
  
    } else {
      // Redirect to home
      res.redirect('/');
    }
  }

  exports.complete_onboarding = async function(req, res, next){
    //get req vars
    const first_name = req.body.first_name;
    const per_email = req.body.per_email;
    const last_name = req.body.last_name;
    const tek_email = req.body.tek_email;
    const share_id = req.body.share_id;
    const licenses = req.body.licenses;

    const pass = pass_gen.gen();

    let params = { title: 'Complete Onboarding', active: { complete_onboarding: true }};
  
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
              }
            }
          }
        }
      }
    } else {
      // Redirect to home
      res.redirect('/');
    }

  }