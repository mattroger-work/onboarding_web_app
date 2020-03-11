require('isomorphic-fetch');
const onboarding_id = 'synaptekcorp1.sharepoint.com,8a01d30a-1420-471d-9ecd-c82887f3084e,d6b56455-a47a-4f3e-8ccb-26af1125e45f';
const hqOnboarding_id = '/169af5d4-390e-47f2-8a86-8970695cd407';
const subOnboarding_id = '/c13b82c3-22d1-4618-81bd-03000a2c2aee';
const time = require('../helpers/time');



  //changes to AD and checks welcome email
  exports.onboard_person = async function(client, share_id){
    
        try {
          obj = {
            "Active_x0020_Directory_x0020_Imp" : true,
            "IT_x0020_Welcome_x0020_Email_x00" : true
          }

          //SET THE VARS OF THE OBJ ON SHAREPOINT
          const result = await client
          .api('/sites/'+onboarding_id+'/lists/'+hqOnboarding_id+'/items/'+share_id+'/fields')
          .update(obj);

          
          console.log('AD and IT Email Updated');
          return true;

        } catch (err) {
          console.log( 'sharepoint err')
          console.log(err)
          return false;
        }
  }

  exports.get_hq_onboardings = async function(client, res, amount) {
    let params = { title: 'HQ Onboarding Tracker', active: { onboard: true }};

      try{
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
        //res.status(200);
        //res.render('hq_onboard_tracker', params);
        return result.value

      } catch (err) {
        params.message = 'Error retrieving messages';
        params.error = { status: `${err.code}: ${err.message}` };
        params.debug = JSON.stringify(err.body, null, 2);
        //res.render('error', params);
      }
  }

  exports.get_sub_onboardings = async function(client, res) {
    let params = { title: 'Sub-Contractors Onboarding Tracker', active: { onboard: true }};
  
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
  }