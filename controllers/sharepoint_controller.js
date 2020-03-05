var auth_helper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const onboarding_id = 'synaptekcorp1.sharepoint.com,8a01d30a-1420-471d-9ecd-c82887f3084e,d6b56455-a47a-4f3e-8ccb-26af1125e45f';
const hqOnboarding_id = '/169af5d4-390e-47f2-8a86-8970695cd407'

  //changes to AD and checks welcome email
  exports.onboard_person = async function(req, res, next){
    let params = { title: 'Sharepoint', active: { sharepoint: true } };
    
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
    
        try {
          obj = {
            "Active_x0020_Directory_x0020_Imp" : true,
            "IT_x0020_Welcome_x0020_Email_x00" : true
          }

          // Get the 10 newest messages from inbox
          const result = await client
          .api('/sites/'+onboarding_id+'/lists/'+hqOnboarding_id+'/items/'+req.body.id+'/fields')
          .update(obj);

          res.send(result).status(201);
          console.log('AD and IT Email Updated');

        } catch (err) {
          console.log( 'sharepoint err')
          console.log(err)
        }
    
      } else {
        // Redirect to home
        res.redirect('/');
      }
  }
